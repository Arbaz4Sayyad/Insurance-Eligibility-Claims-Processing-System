import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Toast notifications (existing)
  const [toastNotifications, setToastNotifications] = useState([]);

  const { user } = useAuth();

  // Persistent notifications (cleared on logout)
  const [persistentNotifications, setPersistentNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      setPersistentNotifications([]);
    } else if (user?.email === 'citizen@iecs.com' && persistentNotifications.length === 0) {
      // Re-seed demo notifications only for the demo account
      setPersistentNotifications([
        { id: 1, title: 'Application Approved', message: 'Your Medical Assistance (MA) benefit has been approved. Proceed to benefits to view your roadmap.', type: 'SUCCESS', read: false, time: '2 hours ago' },
        { id: 2, title: 'Document Required', message: 'A caseworker has requested additional income verification for your SNAP application.', type: 'WARNING', read: false, time: '5 hours ago' },
        { id: 3, title: 'Security Sync', message: 'Your profile was successfully synchronized with regional database nodes.', type: 'INFO', read: true, time: '1 day ago' },
        { id: 4, title: 'Payment Scheduled', message: 'Benefit disbursement of ₹1,500 has been initiated for April.', type: 'SUCCESS', read: true, time: '2 days ago' },
      ]);
    }
  }, [user]);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToastNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToastNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeToastNotification = (id) => {
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Persistent notification handlers
  const markPersistentAsRead = useCallback((id) => {
    setPersistentNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markPersistentAllAsRead = useCallback(() => {
    setPersistentNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deletePersistentNotification = useCallback((id) => {
    setPersistentNotifications(prev => 
      prev.filter(n => n.id !== id)
    );
  }, []);

  const icons = {
    success: <CheckCircle2 className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    warning: <AlertTriangle className="text-orange-500" size={20} />,
    info: <Info className="text-primary-500" size={20} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    info: 'bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800',
  };

  return (
    <NotificationContext.Provider value={{ 
      showNotification, 
      persistentNotifications,
      markPersistentAsRead,
      markPersistentAllAsRead,
      deletePersistentNotification
    }}>
      {children}
      
      {/* Toast Portal */}
      <div className="fixed bottom-6 right-6 z-[200] space-y-3 min-w-[320px] max-w-md">
        <AnimatePresence>
          {toastNotifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${bgColors[n.type]}`}
            >
              <div className="mt-0.5">{icons[n.type]}</div>
              <div className="flex-1">
                 <p className="text-sm font-semibold text-secondary-900 dark:text-white capitalize leading-tight">
                   {n.type}
                 </p>
                 <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                   {n.message}
                 </p>
              </div>
              <button 
                onClick={() => removeToastNotification(n.id)}
                className="text-secondary-400 hover:text-secondary-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
