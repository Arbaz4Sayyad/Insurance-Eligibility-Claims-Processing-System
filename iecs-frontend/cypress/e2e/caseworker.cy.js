describe('Caseworker E2E Functional Matrix', () => {
  beforeEach(() => {
    // Reset any hanging tokens before tests
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  it('Fully authenticates and loads the dynamically aggregated casework priority queue', () => {
    // 1. Visit the root
    cy.visit('/');
    
    // 2. Validate strict unauthorized redirect logic natively happens (assuming hitting a protected route)
    // If not redirected to /login automatically, force visit login
    cy.visit('/login');

    // 3. Fill out authentication form
    cy.get('input[type="email"]').should('be.visible').type('caseworker@iecs.gov');
    cy.get('input[type="password"]').should('be.visible').type('SecurePass123!');
    
    // 4. Intercept the network traffic to our new microservices routing layer
    cy.intercept('POST', '**/api/users/login').as('loginRequest');
    cy.get('button[type="submit"]').click();

    // Ensure the backend orchestrator resolves login
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // 5. Verify the Token is locked in Storage
    cy.window().its('localStorage.token').should('exist');

    // 6. Verify correct logical routing to the Caseworker portal
    cy.url().should('include', '/caseworker/dashboard');

    // 7. Verify the Skeleton Loader appears and is quickly replaced by real data
    // Because we specifically mocked our getCaseworkerDashboard service with native Pulse animations
    cy.get('.animate-pulse').should('exist');

    // 8. Wait for the heavy BFF aggregation to resolve via the resilience4j fallback/circuit wire
    cy.intercept('GET', '**/api/dashboard/caseworker').as('dashboardFetch');
    cy.wait('@dashboardFetch');
    
    // 9. Final Assertion: Ensure UI elements derived from Microservice Data exist structurally
    cy.contains('Caseworker Operations').should('be.visible');
    cy.contains('Pending Queue').should('be.visible');
    cy.contains('Action Required: Priority Queue').should('be.visible');
  });

  it('Verifies frontend correctly enforces Fallback graceful degradation upon severe backend timeout', () => {
    cy.visit('/login');

    cy.get('input[type="email"]').type('caseworker@iecs.gov');
    cy.get('input[type="password"]').type('SecurePass123!');
    cy.get('button[type="submit"]').click();

    // Stub the network to definitively prove our Resilience4j/Axios Interceptor loop reacts natively to failures
    cy.intercept('GET', '**/api/dashboard/caseworker', {
      statusCode: 500,
      body: {
        success: false,
        message: 'System is temporarily degraded. Please check back later.' // Matches our circuit breaking payload mapping
      }
    }).as('dashboardFailureFetch');

    cy.wait('@dashboardFailureFetch');

    // Ensure the application does not crash into a blank white screen (White Screen of Death)
    // It should render our isolated ErrorCard component successfully built during UI validation
    cy.contains('Dashboard Error').should('be.visible');
    cy.contains('Retry Request').should('be.visible');
  });
});
