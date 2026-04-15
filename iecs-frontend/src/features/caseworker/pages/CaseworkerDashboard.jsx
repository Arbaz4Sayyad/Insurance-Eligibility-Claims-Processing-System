import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../../components/common/Stats';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { Skeleton } from '../../../components/common/Skeleton';
import { 
  ClipboardCheck, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '../../../context/ApplicationContext';

const CaseworkerDashboard = () => {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial aggregation sync
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const chartData = [
    { name: 'Approved', value: applications.filter(a => a.status === 'APPROVED').length || 1, color: '#10b981' },
    { name: 'Pending', value: applications.filter(a => a.status === 'PENDING').length || 1, color: '#6366f1' },
    { name: 'Denied', value: applications.filter(a => a.status === 'REJECTED').length || 1, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <AnimatePresence mode="wait">
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                  Case Operations
                  <ClipboardCheck size={24} className="text-primary-500" />
                </h1>
                <p className="text-neutral-500 mt-1 font-medium">Coordinate eligibility determinations and audit workflows.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Queue" value={applications.length} trend="Real-time" color="primary" icon={ClipboardCheck} />
              <StatCard title="Avg Resolution" value={`${(0.5 + applications.length * 0.1).toFixed(1)}d`} trend="-5%" color="success" icon={Clock} />
              <StatCard title="Priority Cases" value={applications.filter(a => a.status === 'PENDING').length} trend="Urgent" color="warning" icon={AlertTriangle} />
              <Card className="flex flex-col justify-center h-[130px] border-slate-800 bg-slate-900/40">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">SLA Accuracy</span>
                </div>
                <p className="text-2xl font-black text-white italic tracking-tight">99.2% <span className="text-sm text-slate-500 font-black">TARGET</span></p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-0 overflow-hidden border-slate-800 shadow-2xl bg-slate-900/10">
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/20">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Application Queue</h3>
                </div>
                <div className="overflow-x-auto text-center">
                  {applications.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800 bg-slate-950">
                          <th className="px-6 py-4">Applicant Profile</th>
                          <th className="px-6 py-4">Submission</th>
                          <th className="px-6 py-4">SLA Status</th>
                          <th className="px-6 py-4">Decision Status</th>
                          <th className="px-6 py-4 text-right pr-8">Context</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {applications.map((app, i) => (
                          <tr key={app.id} className="hover:bg-slate-900/40 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-xs text-primary-500 shadow-inner">
                                  {app.applicant[0]}
                                </div>
                                <div>
                                  <p className="font-black text-white group-hover:text-primary-400 transition-colors tracking-tight">{app.applicant}</p>
                                  <p className="text-[9px] text-slate-500 mt-1 uppercase font-black tracking-widest leading-none">REF: {app.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 font-black text-slate-400 uppercase tracking-tighter">{app.date || 'TODAY'}</td>
                            <td className="px-6 py-5">
                               <Badge variant={app.status === 'PENDING' ? 'warning' : 'primary'}>{app.status === 'PENDING' ? 'URGENT' : 'NORMAL'}</Badge>
                            </td>
                            <td className="px-6 py-5">
                               <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'danger' : 'neutral'}>
                                 {app.status}
                               </Badge>
                            </td>
                            <td className="px-6 py-5 text-right pr-8">
                               <Button 
                                variant="ghost" 
                                size="xs" 
                                className="gap-2 tracking-[0.2em] font-black group-hover:text-primary-400"
                                onClick={() => navigate(`/caseworker/eligibility/${app.id}`)}
                               >
                                  BROWSE
                                  <ArrowRight size={12} />
                               </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-20 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 text-slate-700">
                         <ClipboardCheck size={32} />
                      </div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Queue Empty</p>
                      <p className="text-[10px] text-slate-600 mt-2 italic">Standardizing cluster nodes... No incoming determinations detected.</p>
                    </div>
                  )}
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="p-6 border-slate-800 shadow-xl bg-slate-900/20">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Resolution ROI</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#f8fafc' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CaseworkerDashboard;
