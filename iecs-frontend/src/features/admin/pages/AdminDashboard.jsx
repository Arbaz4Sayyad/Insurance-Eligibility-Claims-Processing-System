import React from 'react';
import { StatCard } from '../../../components/common/Stats';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { Skeleton } from '../../../components/common/Skeleton';
import dashboardService from '../../../services/dashboardService';
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  ShieldAlert,
  ArrowUpRight,
  Activity,
  Server,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await dashboardService.getAdminDashboard();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            System Overview
            {refreshing && <RefreshCw size={20} className="animate-spin text-primary-500" />}
          </h1>
          <p className="text-neutral-500 mt-1 font-medium">Monitoring enterprise cluster health and user throughput</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="sm" onClick={fetchStats} className="bg-slate-900/50 border-slate-700 hover:border-slate-500">
             Export Logs
           </Button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Citizen Network" 
          value={data?.totalUsers || '24.8k'} 
          trend="+12.5%" 
          color="primary"
          icon={Users} 
        />
        <StatCard 
          title="Staff Activity" 
          value={data?.activeCaseworkers || '142'} 
          trend="+4.2%" 
          color="secondary"
          icon={UserCheck} 
        />
        <StatCard 
          title="Active Claims" 
          value={data?.applicationsThisMonth || '3.5k'} 
          trend="+18.1%" 
          color="success"
          icon={BarChart3} 
        />
        <Card className="flex flex-col justify-between h-[130px] border-slate-800 bg-slate-900/40">
           <div className="flex items-center justify-between">
             <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Node Health</p>
             <Badge variant={data?.systemHealth?.status === 'UP' ? 'success' : 'warning'}>
               {data?.systemHealth?.status || 'Active'}
             </Badge>
           </div>
           <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-2xl font-black text-white">99.8<span className="text-sm text-slate-500">%</span></span>
                <p className="text-[10px] text-slate-500 font-black uppercase">Uptime Score</p>
              </div>
              <div className="h-8 flex items-end gap-0.5">
                 {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    className="w-1.5 bg-primary-500/40 rounded-t-sm shadow-[0_0_10px_rgba(37,99,235,0.2)]" 
                   />
                 ))}
              </div>
           </div>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden border-slate-800">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
             <h3 className="text-sm font-black text-white flex items-center gap-2 tracking-tight uppercase">
               <Activity size={16} className="text-primary-500" />
               Throughput & Growth
             </h3>
             <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['24h', '7d', '30d'].map(t => (
                   <button key={t} className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${t === '30d' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t}
                  </button>
                ))}
             </div>
          </div>
          <div className="p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Jan', val: 4000 }, { name: 'Feb', val: 3000 }, { name: 'Mar', val: 5500 },
                  { name: 'Apr', val: 4200 }, { name: 'May', val: 7800 }, { name: 'Jun', val: 6200 }, { name: 'Jul', val: 8100 }
                ]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                    itemStyle={{ fontSize: '11px', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}
                    labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Real-time Security Log */}
        <Card className="p-0 overflow-hidden border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Security Feed</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="p-6 space-y-6 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
            {(data?.recentActivities || []).map((act, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex gap-4 items-start group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-primary-500/10 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all shrink-0 shadow-inner">
                  {act.type?.[0] || 'L'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-200 truncate group-hover:text-white transition-colors tracking-tight">
                    {act.type}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-black uppercase tracking-widest">
                    {act.id} • {act.time}
                  </p>
                </div>
              </motion.div>
            ))}
            {(!data?.recentActivities || data.recentActivities.length === 0) && (
              <div className="text-center py-12">
                <ShieldAlert className="mx-auto text-slate-800 mb-4" size={32} />
                <p className="text-xs text-slate-600 font-black uppercase tracking-widest">No Security Events</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-900/20 border-t border-slate-800">
            <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-widest gap-2 text-slate-500 hover:text-white hover:bg-slate-800/50 transition-all">
              View All Logs
              <ExternalLink size={14} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;


