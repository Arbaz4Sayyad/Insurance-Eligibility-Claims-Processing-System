import React, { createContext, useContext, useState, useEffect } from 'react';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('iecs-applications');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'APP-8042', 
        applicant: 'Alexander Wright', 
        income: 42000, 
        household: 3, 
        plan: 'Medical Care Plus', 
        status: 'PENDING', 
        date: '2026-04-01',
        history: [{ status: 'SUBMITTED', date: '2026-04-01', note: 'Initial submission' }]
      },
      { 
        id: 'APP-7182', 
        applicant: 'Elena Rodriguez', 
        income: 18000, 
        household: 1, 
        plan: 'Basic Health', 
        status: 'APPROVED', 
        date: '2026-03-28',
        history: [
          { status: 'SUBMITTED', date: '2026-03-28', note: 'Initial submission' },
          { status: 'APPROVED', date: '2026-03-30', note: 'Income verification successful' }
        ]
      },
    ];
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Identity Verified', message: 'Your biometric sync is complete.', type: 'info', read: false },
    { id: 2, title: 'Action Required', message: 'Please upload income proof for APP-8042.', type: 'warning', read: false },
  ]);

  useEffect(() => {
    localStorage.setItem('iecs-applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = (appData) => {
    const newApp = {
      ...appData,
      id: `APP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      history: [{ status: 'SUBMITTED', date: new Date().toISOString(), note: 'Applied via Citizen Portal' }]
    };
    setApplications(prev => [newApp, ...prev]);
    
    // Add caseworker notification
    setNotifications(prev => [
      { 
        id: Date.now(), 
        title: 'New Application', 
        message: `New application received from ${appData.applicant}`, 
        type: 'info', 
        read: false 
      },
      ...prev
    ]);
  };

  const updateApplicationStatus = (appId, status, note, actor = 'System') => {
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { 
            ...app, 
            status, 
            history: [
              ...app.history, 
              { 
                status, 
                date: new Date().toISOString(), 
                note,
                actor
              }
            ] 
          } 
        : app
    ));

    // Also trigger a system notification for synchronization
    setNotifications(prev => [
      { 
        id: Date.now(), 
        title: `Status Updated: ${status}`, 
        message: `Application ${appId} has been updated to ${status}.`, 
        type: status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'danger' : 'info', 
        read: false 
      },
      ...prev
    ]);
  };

  return (
    <ApplicationContext.Provider value={{ 
      applications, 
      addApplication, 
      updateApplicationStatus,
      notifications,
      setNotifications 
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('useApplications must be used within ApplicationProvider');
  return context;
};
