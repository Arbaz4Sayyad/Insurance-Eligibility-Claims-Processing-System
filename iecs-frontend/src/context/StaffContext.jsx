import React, { createContext, useContext, useState, useEffect } from 'react';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const [workers, setWorkers] = useState(() => {
    const saved = localStorage.getItem('iecs_staff');
    if (saved) return JSON.parse(saved);
    
    // Default system seeding
    return [
      { id: 1, name: 'John Doe', apps: 45, status: 'ACTIVE', efficiency: '98%', lastActive: '2 mins ago' },
      { id: 2, name: 'Sarah Miller', apps: 12, status: 'ACTIVE', efficiency: '94%', lastActive: '10 mins ago' },
      { id: 3, name: 'Michael Chen', apps: 0, status: 'INACTIVE', efficiency: '88%', lastActive: '2 days ago' },
      { id: 4, name: 'Emma Wilson', apps: 38, status: 'ACTIVE', efficiency: '96%', lastActive: 'Just now' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('iecs_staff', JSON.stringify(workers));
  }, [workers]);

  const toggleWorkerStatus = (id) => {
    setWorkers(prev => prev.map(w => 
      w.id === id ? { ...w, status: w.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : w
    ));
  };

  const addWorker = (name) => {
    const newWorker = {
      id: Date.now(),
      name,
      apps: 0,
      status: 'ACTIVE',
      efficiency: '100%',
      lastActive: 'Just now'
    };
    setWorkers(prev => [...prev, newWorker]);
  };

  return (
    <StaffContext.Provider value={{ workers, toggleWorkerStatus, addWorker }}>
      {children}
    </StaffContext.Provider>
  );
};
