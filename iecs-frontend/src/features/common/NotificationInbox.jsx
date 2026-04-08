import React from 'react';
import { Card, Button, Badge } from '../../components/common/UIComponents';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  Zap,
  MoreVertical,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const NotificationInbox = () => {
  const { 
    persistentNotifications: notifications, 
    markPersistentAsRead: markRead, 
    markPersistentAllAsRead: markAllAsRead, 
    deletePersistentNotification: deleteNotification 
  } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS': return <ShieldCheck className="text-emerald-400" size={18} />;
      case 'WARNING': return <AlertCircle className="text-orange-400" size={18} />;
      case 'INFO': return <Zap className="text-primary-400" size={18} />;
      default: return <Info className="text-neutral-400" size={18} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             System Alerts
             <Bell size={28} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Operational updates and eligibility notifications.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="gap-2" onClick={markAllAsRead}>
             <CheckCheck size={18} />
             Mark All Read
           </Button>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, idx) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <Card className={`p-0 overflow-hidden border-white/5 transition-all group ${
                !notification.read ? 'bg-primary-500/[0.03] border-primary-500/20 shadow-lg shadow-primary-500/5' : 'bg-neutral-900/20'
              }`}>
                <div className="flex items-center gap-6 p-6">
                   <div className={`w-12 h-12 rounded-2xl bg-neutral-950 border border-white/5 flex items-center justify-center relative ${
                     !notification.read ? 'ring-1 ring-primary-500/30' : ''
                   }`}>
                      {getIcon(notification.type)}
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-[#0a0a0c]" />
                      )}
                   </div>
                   
                   <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                         <h4 className={`text-sm font-black uppercase tracking-tight ${!notification.read ? 'text-white' : 'text-neutral-400'}`}>
                           {notification.title}
                         </h4>
                         <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{notification.time}</span>
                      </div>
                      <p className={`text-xs leading-relaxed max-w-2xl ${!notification.read ? 'text-neutral-300' : 'text-neutral-500'}`}>
                         {notification.message}
                      </p>
                   </div>

                   <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          className="text-[10px] uppercase font-black tracking-widest text-primary-400"
                          onClick={() => markRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2.5 rounded-xl hover:bg-red-500/10 text-neutral-700 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                      >
                         <Trash2 size={16} />
                      </button>
                      <button className="p-2.5 rounded-xl hover:bg-white/5 text-neutral-700 transition-all">
                         <MoreVertical size={16} />
                      </button>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-30 italic">
             <Mail size={48} className="mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest">Inbox Zero Achieved</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationInbox;
