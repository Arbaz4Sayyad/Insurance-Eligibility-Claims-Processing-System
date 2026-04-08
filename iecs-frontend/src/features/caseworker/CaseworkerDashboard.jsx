import React from 'react';
import { StatCard } from '../../../components/common/Stats';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { DashboardSkeleton } from '../../../components/common/Skeleton';
import dashboardService from '../../../services/dashboardService';
import { 
  ClipboardCheck, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
  LayoutGrid,
  List as ListIcon,
  Inbox
} from 'lucide-react';
import { motion } from 'framer-motion';

const CaseworkerDashboard = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardService.getCaseworkerDashboard();
        if (res.success) setData(res.data);
      } catch (err) {
        console.error('Failed to fetch caseworker stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <DashboardSkeleton />;

  const queue = data?.priorityQueue || [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-left">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Operational Queue</h1>
          <p className="text-xs text-neutral-500 mt-1 font-medium">Manage pending applications and eligibility determinations</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-neutral-950 p-1 rounded-lg border border-border">
              <button className="p-1.5 rounded-md text-primary-400 bg-neutral-800"><LayoutGrid size={14} /></button>
              <button className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-300"><ListIcon size={14} /></button>
           </div>
           <Button variant="primary" size="sm" className="gap-2 shadow-stripe bg-primary-600 hover:bg-primary-500 text-white border-none">
             <Filter size={14} />
             Filters
           </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Pending Queue" 
          value={data?.pendingApplications || '0'} 
          trend={data?.pendingApplications > 10 ? 'up' : 'down'} 
          trendValue={data?.pendingApplications > 10 ? 'Breaching' : 'Healthy'} 
          icon={ClipboardCheck} 
        />
        <StatCard 
          title="Approved Today" 
          value={data?.approvedToday || '0'} 
          icon={CheckCircle2} 
        />
        <StatCard 
          title="Approval Rate" 
          value={data?.approvalRate ? `${data.approvalRate.toFixed(1)}%` : '---'} 
          trend="up" 
          trendValue="System Target"
          icon={ShieldCheck} 
        />
      </div>

      {/* Main Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground capitalize tracking-wide">High Priority Applications</h3>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{queue.length} Cases Pending</span>
           </div>

           <div className="space-y-3">
             {queue.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-neutral-950 border border-dashed border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mb-4 text-neutral-600">
                    <Inbox size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1 font-sans">Queue Is Fully Clear</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6 font-medium leading-relaxed">No pending applications require immediate attention. All SLAs are currently within safe thresholds.</p>
                  <Button variant="outline" size="sm" className="rounded-full text-[10px] uppercase font-bold tracking-widest px-6 border-neutral-800 hover:bg-neutral-900 hover:text-foreground">
                    System Sync
                  </Button>
                </motion.div>
             ) : (
               queue.map((app, idx) => (
                 <Card key={idx} className="p-4 hover:border-primary-500/30 group transition-all relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-border flex items-center justify-center text-primary-400 font-bold text-xs uppercase tracking-tighter">
                             {app.plan?.[0] || 'A'}
                          </div>
                          <div className="min-w-0">
                             <h4 className="text-sm font-bold text-foreground leading-none">{app.applicantName}</h4>
                             <p className="text-[10px] text-neutral-500 mt-1.5 font-medium flex items-center gap-2">
                                <span className={app.slaBreach ? 'text-red-500 font-bold' : 'text-primary-500 font-bold'}>{app.plan}</span>
                                <span className="w-px h-2.5 bg-neutral-800" />
                                Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                             </p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <Badge variant={app.slaBreach ? 'danger' : 'warning'}>
                            {app.slaBreach ? 'SLA Breach' : 'In Review'}
                          </Badge>
                          <button className="p-2 text-neutral-500 hover:text-primary-400 hover:bg-neutral-900 rounded-lg transition-all">
                             <ArrowRight size={16} />
                          </button>
                       </div>
                    </div>
                 </Card>
               ))
             )}
           </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold text-foreground capitalize tracking-wide leading-none mb-1">Queue Intelligence</h3>
           <Card className="p-4 bg-gradient-to-b from-neutral-900 to-background border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-500/10 text-primary-400 rounded-lg">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="text-xs font-bold text-foreground">Compliance Guard</h4>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed mb-4">
                System accurately processed <b>{data?.approvedToday || 0}</b> cases today. Automatic verification is active for all Medical benefit plans.
              </p>
              <Button variant="outline" size="sm" className="w-full text-[10px] uppercase font-bold border-neutral-800 hover:bg-neutral-900">
                Performance Dashboard
              </Button>
           </Card>

           <Card className="p-4 border-border">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Recent Activity</h4>
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-start gap-3 group cursor-pointer">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 mt-1.5 group-hover:bg-primary-500 transition-colors" />
                      <div className="min-w-0">
                         <p className="text-[11px] font-bold text-neutral-400 group-hover:text-foreground transition-colors tracking-tight">System Processed Case #00{i*42}</p>
                         <p className="text-[9px] text-neutral-600 font-medium">Automatic determination completed</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default CaseworkerDashboard;
