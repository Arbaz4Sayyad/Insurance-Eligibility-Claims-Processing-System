import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import staffService from '../services/staffService';
import { toast } from 'react-hot-toast';

const StaffContext = createContext();

export const useStaff = () => useContext(StaffContext);

export const StaffProvider = ({ children }) => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Reset on logout
  useEffect(() => {
    if (!user) {
      setWorkers([]);
    } else if (user.role === 'ADMIN') {
      loadWorkers();
    }
  }, [user]);

  const loadWorkers = async () => {
    try {
      setIsLoading(true);
      const res = await staffService.getAllStaff();
      // Handle array vs ApiResponse wrapper
      const rawList = Array.isArray(res) ? res : (res.data || []);
      const staffList = rawList.filter(u => 
        u.roles && u.roles.some(r => r.name === 'ROLE_CASE_WORKER')
      );
      
      setWorkers(staffList.map(u => ({
        id: u.id,
        name: u.username.charAt(0).toUpperCase() + u.username.slice(1).replace('_', ' '),
        email: u.email,
        apps: Math.floor(Math.random() * 50), // Random for demo
        status: u.enabled ? 'ACTIVE' : 'INACTIVE',
        efficiency: (85 + Math.floor(Math.random() * 15)) + '%',
        lastActive: 'Active'
      })));
    } catch (err) {
      console.error('Failed to load staff:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWorkerStatus = async (id) => {
    const worker = workers.find(w => w.id === id);
    if (!worker) return;

    try {
      await staffService.toggleStatus(id, worker.status);
      setWorkers(prev => prev.map(w => 
        w.id === id ? { ...w, status: w.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : w
      ));
      toast.success(`Worker ${worker.status === 'ACTIVE' ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const addWorker = async (name, email, password) => {
    try {
      // Map frontend 'name' to backend 'username' if missing
      const res = await staffService.onboardStaff({ name, email, password });
      
      // Ensure we extract data from ApiResponse if present
      const newUser = res.success ? res.data : res;
      
      const mapped = {
        id: newUser.id,
        name: name,
        email: email,
        apps: 0,
        status: 'ACTIVE',
        efficiency: '100%',
        lastActive: 'Just now'
      };
      
      setWorkers(prev => [...prev, mapped]);
      toast.success('Caseworker provisioned successfully');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to onboard caseworker');
      return { success: false, error: err.message };
    }
  };

  return (
    <StaffContext.Provider value={{ workers, toggleWorkerStatus, addWorker, isLoading }}>
      {children}
    </StaffContext.Provider>
  );
};
