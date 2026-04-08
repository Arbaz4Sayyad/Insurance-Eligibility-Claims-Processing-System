import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, User, ChevronDown, Command, Layers, ClipboardCheck, Settings, ShieldCheck, LogOut, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

import { useApplications } from '../../context/ApplicationContext';
import { useNotification } from '../../context/NotificationContext';
import { navConfig } from '../../config/navigation';

const Topbar = () => {
  const { user } = useAuth();
  const { applications } = useApplications();
  const { persistentNotifications, markPersistentAllAsRead } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const menuRef = React.useRef(null);

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const hasUnread = persistentNotifications.some(n => !n.read);

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    markPersistentAllAsRead();
    navigate(user?.role === 'CASEWORKER' ? '/caseworker/notifications' : '/dashboard/notifications');
  };

  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 flex items-center justify-between px-10 sticky top-0 z-[40]">
      {/* Search & Breadcrumbs */}
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
           <Layers size={18} className="text-primary-500" />
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Main</span>
             <span className="text-slate-700">/</span>
             {pathSegments.map((seg, i) => (
                <React.Fragment key={seg}>
                  <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${i === pathSegments.length - 1 ? 'text-white' : 'text-slate-500'}`}>
                    {seg.replace(/-/g, ' ')}
                  </span>
                  {i < pathSegments.length - 1 && <span className="text-slate-700">/</span>}
                </React.Fragment>
              ))}
           </div>
        </div>

        {/* Search Command (Functional Style) */}
        <div className="relative hidden lg:block">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border transition-all w-80 ${showResults ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-slate-800 hover:border-slate-700'}`}>
            <Search size={16} className={searchQuery ? 'text-primary-400' : 'text-slate-500'} />
            <input 
              type="text"
              placeholder="Search claims or commands..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(!!e.target.value);
              }}
              onFocus={() => searchQuery && setShowResults(true)}
              className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-slate-600 w-full"
            />
            <div className="flex items-center gap-1.5 opacity-40">
               <Command size={12} className="text-slate-500" />
               <span className="text-[10px] font-bold text-slate-500">K</span>
            </div>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[100] overflow-hidden"
              >
                <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {/* Results logic */}
                  {(() => {
                    const pages = navConfig[user?.role || 'CITIZEN']
                      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(p => ({ ...p, type: 'page' }));
                    
                    const claims = applications
                      .filter(a => a.id.toLowerCase().includes(searchQuery.toLowerCase()) || a.applicant.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(a => ({ name: `${a.applicant} (${a.id})`, path: user?.role === 'CASEWORKER' ? `/caseworker/eligibility/${a.id}` : '/dashboard/status', type: 'claim', icon: ClipboardCheck }));

                    const results = [...pages, ...claims];

                    if (results.length === 0) {
                      return <p className="p-4 text-[10px] text-slate-600 font-black uppercase text-center">No matches found</p>;
                    }

                    return results.map((res, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(res.path);
                          setShowResults(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-primary-400">
                          {res.icon ? <res.icon size={14} /> : <Search size={14} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300 group-hover:text-white">{res.name}</p>
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{res.type}</p>
                        </div>
                      </button>
                    ));
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6 h-full">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleNotificationClick}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all relative group flex items-center justify-center"
          >
            <Bell size={20} className="group-hover:animate-shake" />
            {hasUnread && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
            )}
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-slate-800"></div>

        <div className="relative h-full flex items-center" ref={menuRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-4 pl-2 group cursor-pointer h-full transition-all"
          >
            <div className="flex flex-col items-end hidden sm:flex justify-center h-full">
               <span className="text-xs font-black text-white leading-none capitalize tracking-tight group-hover:text-primary-400 transition-colors">{user?.username}</span>
               <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                    <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping opacity-75"></span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase leading-none">{user?.role}</span>
               </div>
            </div>
            <div className="relative flex items-center h-full">
              <div className={`w-10 h-10 rounded-2xl bg-slate-900 border transition-all duration-300 flex items-center justify-center text-primary-400 font-black text-sm overflow-hidden shadow-xl ${
                showProfileMenu ? 'border-primary-500 scale-105 ring-4 ring-primary-500/10' : 'border-slate-700 group-hover:border-slate-500 group-hover:scale-105'
              }`}>
                 {user?.username?.[0]?.toUpperCase() || 'U'}
                 {/* Decorative Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-lg bg-slate-950 border transition-all flex items-center justify-center ${
                showProfileMenu ? 'border-primary-500 rotate-180' : 'border-slate-800'
              }`}>
                 <ChevronDown size={10} className={showProfileMenu ? 'text-primary-400' : 'text-slate-400 group-hover:text-white'} />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-[100] overflow-hidden backdrop-blur-xl"
              >
                <div className="p-3 border-b border-slate-800 bg-slate-900/40">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-black text-xs">
                       {user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">Signed in as</p>
                      <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  {[
                    { label: 'Profile Settings', icon: User, path: '/dashboard/profile' },
                    { label: 'Security sync', icon: ShieldCheck, path: '/dashboard/security', badge: 'Active' },
                    { label: 'Preferences', icon: Settings, path: '/dashboard/settings' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate(item.path);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900 text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all">
                          <item.icon size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-black uppercase tracking-tighter bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-2 mt-1 border-t border-slate-800">
                  <button 
                    onClick={() => {
                      // Add logout logic if available, or just navigate
                      setShowProfileMenu(false);
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/10 text-left group transition-all"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-red-400 group-hover:border-red-500/30 transition-all">
                      <LogOut size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-red-400 transition-colors">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
