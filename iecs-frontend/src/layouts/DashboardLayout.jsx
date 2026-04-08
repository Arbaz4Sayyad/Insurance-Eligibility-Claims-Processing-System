import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex overflow-hidden">
      {/* Sidebar Navigation - Fixed Position */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out relative ${
          isCollapsed ? 'pl-[70px]' : 'pl-64'
        }`}
      >
        {/* Sticky Topbar */}
        <Topbar isCollapsed={isCollapsed} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0 flex flex-col">
          <div className="container mx-auto p-6 flex-1 max-w-[1600px]">
             <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Outlet />
              </motion.div>
          </div>

          {/* Subtle Workspace Footer */}
          <footer className="mt-auto py-10 px-10 border-t border-slate-800 bg-slate-900/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">
                IECS Secure Instance • v4.2.0 • Build ID: 804BD0B6
              </p>
              <div className="flex items-center gap-6">
                 {['Privacy', 'Security', 'Support'].map(link => (
                   <a key={link} href="#" className="text-[10px] font-black text-slate-600 hover:text-primary-400 transition-colors uppercase tracking-widest leading-none">
                     {link}
                   </a>
                 ))}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};


export default DashboardLayout;

