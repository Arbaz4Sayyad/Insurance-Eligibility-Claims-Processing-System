/**
 * IECS Eligibility Engine
 * Functional logic for benefit determination based on enterprise rules.
 */

export const evaluateEligibility = (app) => {
  const { income, household, age = 30, employment = 'Employed', children = 0 } = app;
  const perPersonIncome = income / household;

  // Rule 1: Medicaid (Very low income + Seniors or Unemployed)
  if (income < 1000 * household && (age > 60 || employment === 'Unemployed')) {
    return {
      status: 'APPROVE',
      plan: 'Medicaid Universal',
      benefit: '$1,200/mo',
      reason: 'Applicant meets the income and vulnerability criteria for Medicaid support.'
    };
  }

  // Rule 2: SNAP (Low income + Household size >= 2)
  if (income < 1500 * household && household >= 2) {
    return {
      status: 'APPROVE',
      plan: 'SNAP Food Assistance',
      benefit: '$450/mo',
      reason: 'Household income is below the nutritional support threshold.'
    };
  }

  // Rule 3: CCAP (Child Care Assistance - Low income + Children > 0)
  if (income < 2500 * household && children > 0) {
    return {
      status: 'APPROVE',
      plan: 'CCAP Child Care',
      benefit: '$800/mo',
      reason: 'Applicant qualifies for child care subsidy based on family size and reported income.'
    };
  }

  // Rule 4: QHP (Qualified Health Plan - Fallback)
  if (income < 5000 * household) {
    return {
      status: 'MANUAL',
      plan: 'QHP Standard Health',
      benefit: 'Tax Credit Only',
      reason: 'Applicant exceeds direct subsidy thresholds. Recommending Qualified Health Plan with tax credits.'
    };
  }

  // Fallback: Default/Reject
  return {
    status: 'REJECT',
    plan: 'None',
    benefit: 'None',
    reason: 'Reported income exceeds the maximum threshold for all integrated benefit programs.'
  };
};
