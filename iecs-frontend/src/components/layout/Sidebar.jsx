import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { navConfig } from '../../config/navigation';
import { 
  ChevronLeft, 
  Menu, 
  LogOut, 
  Shield, 
  User, 
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role || 'CITIZEN';
  const menuItems = navConfig[role] || [];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 256 }}
      className="fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800/60 flex flex-col z-[50] shadow-2xl transition-all duration-300 ease-in-out"
    >
      {/* Branding */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/60 bg-slate-900/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-black tracking-tighter text-white"
              >
                IECS<span className="text-primary-500">.</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-2 custom-scrollbar">
        <div className="px-3 mb-2">
          {!isCollapsed && (
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">
              Main Cluster
            </p>
          )}
        </div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative group
              ${isActive 
                ? 'bg-primary-500/10 text-primary-400 font-bold' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'group-hover:text-slate-200'}`}>
                  <item.icon size={20} />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-5 bg-primary-500 rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900/20">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0 border border-slate-700">
            <User size={16} className="text-slate-400" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-none capitalize">{user?.username}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-tighter font-black mt-1 truncate">{role}</p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={logout}
              className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="mt-4 w-full h-8 flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
        >
          {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>

  );
};

export default Sidebar;
