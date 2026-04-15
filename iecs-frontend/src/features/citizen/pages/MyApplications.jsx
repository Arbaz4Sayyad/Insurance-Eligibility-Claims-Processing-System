import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { 
  FileText, 
  Search, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '../../../context/ApplicationContext';
import { useNavigate, useLocation } from 'react-router-dom';

const MyApplications = () => {
  const { applications } = useApplications();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const queryParams = new URLSearchParams(location.search);
  const selectedId = queryParams.get('id');
  const selectedApp = applications.find(a => a.id === selectedId);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.plan.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'REJECTED': return <XCircle className="text-red-500" size={18} />;
      case 'PENDING': return <Clock className="text-amber-500" size={18} />;
      default: return <AlertCircle className="text-slate-500" size={18} />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'PENDING': return 'primary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Applications</h1>
          <p className="text-neutral-500 mt-1 font-medium italic">
            Trace the lifecycle of your benefit enrollments and determination status.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/dashboard/apply')}
          className="shadow-primary-500/20"
        >
          New Application
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 bg-slate-900/40 border-slate-800 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search by plan or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:ring-1 focus:ring-primary-500/50 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                statusFilter === status 
                  ? 'bg-primary-500/10 border-primary-500/50 text-primary-400' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredApplications.map((app, idx) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              >
                <Card className="p-0 overflow-hidden group hover:border-primary-500/30 transition-all border-slate-800 bg-slate-900/10">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-primary-400 shadow-inner group-hover:scale-110 transition-transform">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-black text-white uppercase tracking-tight">{app.plan}</h3>
                          <Badge variant={getStatusVariant(app.status)} size="xs" className="text-[9px] uppercase font-black px-2 py-0.5">
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">ID: {app.id}</span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full" />
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Submitted: {app.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Current Milestone</p>
                        <div className="flex items-center gap-2">
                           {getStatusIcon(app.status)}
                           <span className="text-xs font-bold text-white">
                             {app.status === 'PENDING' ? 'Under Review' : app.status === 'APPROVED' ? 'Benefit Active' : 'Denied'}
                           </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 group-hover:text-primary-400 font-black uppercase tracking-widest p-0 border-none px-4 bg-slate-900"
                        onClick={() => navigate(`/dashboard/status?id=${app.id}`)}
                      >
                        Details
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Card className="p-20 border-dashed border-slate-800 bg-slate-900/5 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 text-slate-700">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">No Records Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium leading-relaxed italic">
              Try adjusting your search filters or submit a new application to start synchronization.
            </p>
          </Card>
        )}
      </div>

      {/* Details View (When an app is selected) */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
          >
            <Card className="w-full max-w-2xl p-8 bg-slate-900 border-slate-800 shadow-2xl relative">
              <button 
                onClick={() => navigate('/dashboard/status')}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:text-white"
              >
                <XCircle size={20} />
              </button>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                  <FileText size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedApp.plan}</h2>
                    <Badge variant={getStatusVariant(selectedApp.status)}>{selectedApp.status}</Badge>
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Application ID: {selectedApp.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Submission Date</p>
                  <p className="text-sm font-bold text-white">{selectedApp.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Applicant Type</p>
                  <p className="text-sm font-bold text-white">Regular Benefit</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Processing Node</p>
                  <p className="text-sm font-bold text-emerald-400">Active - Cluster 4</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Last Activity</p>
                  <p className="text-sm font-bold text-white">Verification Pending</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <Button variant="outline" onClick={() => navigate('/dashboard/status')}>Close View</Button>
                <Button variant="primary">Download Receipt</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyApplications;
