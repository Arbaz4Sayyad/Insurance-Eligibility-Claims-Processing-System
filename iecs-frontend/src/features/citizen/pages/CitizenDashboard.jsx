import React from 'react';
import { Card, Button, Badge, Skeleton } from '../../../components/common/UIComponents';
import dashboardService from '../../../services/dashboardService';
import { 
  FileText, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Inbox,
  Sparkles,
  Search,
  ChevronRight,
  Bell,
  Zap,
  Info,
  TrendingUp,
  CreditCard,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApplications } from '../../../context/ApplicationContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Modal, Input } from '../../../components/common/UIComponents';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const { applications, notifications } = useApplications();
  const navigate = useNavigate();
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSupportOpen, setIsSupportOpen] = React.useState(false);
  const [supportMsg, setSupportMsg] = React.useState('');
  
  const myApplications = applications; // In real app, filter by user ID

  const benefits = [
    { name: 'Medical Care Plus', description: 'Comprehensive health coverage for families.', eligibility: 'Income < $50,000' },
    { name: 'Food Assistance', description: 'Monthly credit for essential nutrition.', eligibility: 'Household > 2 & Income < $30,000' },
    { name: 'Child Care Subsidy', description: 'Support for working parents with children under 12.', eligibility: 'Working status: Active' },
  ];

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getCitizenDashboard();
      if (response && response.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to sync citizen account details');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSupportSubmit = () => {
    if (supportMsg.trim()) {
      alert("Support request sent! A caseworker will contact you shortly.");
      setSupportMsg('');
      setIsSupportOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
             {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
          <div className="space-y-4">
             <Skeleton className="h-40 w-full" />
             <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Welcome back, Citizen
             <Sparkles size={24} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">
            Monitoring {myApplications.length} active process{myApplications.length !== 1 ? 'es' : ''} in your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant="outline" 
            className="gap-2 bg-slate-900/50 border-slate-700 hover:border-slate-500"
            onClick={() => setIsSupportOpen(true)}
           >
             Quick Support
           </Button>
           <Button 
            variant="primary" 
            className="gap-2 shadow-primary-500/20 px-6"
            onClick={() => navigate('/dashboard/apply')}
           >
             <Plus size={18} />
             Apply for Benefit
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Applications Roadmap */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Zap size={16} className="text-primary-500" />
                Active Roadmap
              </h3>
              <Badge variant="primary" className="bg-primary-500/10 uppercase tracking-tighter">{myApplications.length} Active</Badge>
           </div>

            <div className="grid grid-cols-1 gap-4">
              {myApplications.length > 0 ? myApplications.map((app, idx) => (
                <Card key={app.id} className="p-0 overflow-hidden group hover:border-primary-500/20 transition-all border-slate-800 shadow-xl bg-slate-900/10">
                  <div className="p-5 bg-slate-900/40 flex items-center justify-between border-b border-slate-800">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-primary-400 shadow-inner">
                           <FileText size={20} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{app.plan}</h4>
                           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic leading-none">Process ID: {app.id}</p>
                        </div>
                     </div>
                     <Badge variant={app.status === 'APPROVED' ? 'success' : 'primary'}>
                       {app.status}
                     </Badge>
                  </div>
                  <div className="p-5">
                     <div className="flex items-center justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Submitted: {app.date}</span>
                        <span className="text-white italic">Pipeline Status: Operational</span>
                     </div>
                     <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-900">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-slate-600" />
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-tight">Last Activity: Just now</span>
                           </div>
                        </div>
                        <Button variant="ghost" size="xs" className="gap-2 group-hover:text-primary-400 font-black uppercase tracking-widest p-0 border-none">
                           Timeline Details
                           <ChevronRight size={14} />
                        </Button>
                     </div>
                  </div>
                </Card>
              )) : (
                <Card className="p-12 border-dashed border-slate-800 bg-slate-900/5 text-center">
                   <Inbox size={48} className="mx-auto text-slate-800 mb-4" />
                   <p className="text-xs text-slate-500 font-black uppercase tracking-widest">No Active Enrollments Detected</p>
                </Card>
              )}
            </div>

            {/* Benefit Catalog */}
            <div className="space-y-6 pt-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck size={16} className="text-emerald-500" />
                 Synchronized Benefit Catalog
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, i) => (
                    <Card 
                      key={i} 
                      onClick={() => navigate('/dashboard/apply')}
                      className="p-6 bg-slate-950 border-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer group"
                    >
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{benefit.name}</h4>
                          <Info size={14} className="text-slate-700 group-hover:text-emerald-500" />
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold mb-4 leading-relaxed">{benefit.description}</p>
                       <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Eligibility Match: 95%</span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">{benefit.eligibility}</span>
                       </div>
                    </Card>
                  ))}
               </div>
            </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
            <Card className="p-8 bg-primary-500/5 relative overflow-hidden border-primary-500/10 group shadow-xl h-fit">
               <div className="relative z-10">
                 <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-6 border border-primary-500/20">
                    <ShieldCheck size={24} />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">Enterprise Security</h4>
                 <p className="text-xs text-slate-500 leading-relaxed font-black italic mb-6 tracking-tight">
                   "Your profile is protected by 256-bit encryption. Eligibility verification is synchronized with federal databases in real-time."
                 </p>
                 <Button variant="outline" size="sm" className="w-full uppercase font-black text-[10px] tracking-widest gap-2 bg-slate-950 border-slate-800 group-hover:border-primary-500/40 transition-all">
                    Security Hub
                    <ArrowRight size={14} />
                 </Button>
               </div>
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-primary-500">
                 <TrendingUp size={120} />
               </div>
            </Card>

            <Card className="p-6 bg-slate-900/20 border-slate-800">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Recent Alerts</h4>
               <div className="space-y-4">
                  {notifications.filter(n => !n.read).slice(0, 3).map((alert, i) => (
                    <div key={i} className="flex gap-3 items-start border-l-2 border-primary-500/30 pl-4 py-1">
                       <div>
                          <p className="text-[9px] font-black text-white uppercase tracking-tighter">{alert.title}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{alert.message}</p>
                       </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-[10px] text-slate-600 italic font-black uppercase">No active alerts</p>
                  )}
               </div>
            </Card>
        </div>
      </div>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Quick Support Hub">
        <div className="space-y-6">
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            Describe your issue or question below. Our caseworker team will be alerted immediately.
          </p>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Message</label>
            <textarea 
              value={supportMsg}
              onChange={(e) => setSupportMsg(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-primary-500/50 outline-none h-32"
              placeholder="How can we help you today?"
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsSupportOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSupportSubmit}>Send Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CitizenDashboard;

