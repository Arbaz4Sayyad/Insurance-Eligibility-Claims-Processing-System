import React from 'react';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Zap, 
  Clock, 
  CheckCircle2 
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
import { useApplications } from '../../../context/ApplicationContext';

const SystemIntelligence = () => {
  const [dateRange, setDateRange] = React.useState('30D');
  const { applications } = useApplications();

  const totalVolume = applications.length;
  const approvals = applications.filter(a => a.status === 'APPROVED').length;
  const rejections = applications.filter(a => a.status === 'REJECTED').length;
  const pending = applications.filter(a => a.status === 'PENDING').length;
  const approvalRate = totalVolume > 0 ? ((approvals / totalVolume) * 100).toFixed(1) : '0.0';

  const performanceData = [
    { name: 'Total Cases', applications: totalVolume, approvals: approvals, rejections: rejections },
    { name: 'Current Active', applications: pending, approvals: 0, rejections: 0 },
  ];

  const latencyData = [
    { stage: 'Submission', avg: 1.2 },
    { stage: 'Data Collection', avg: 4.5 },
    { stage: 'Eligibility', avg: 0.8 },
    { stage: 'Review', avg: 12.4 },
    { stage: 'Issuance', avg: 2.1 },
  ];

  const exportToCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      `Total Volume,${totalVolume}`,
      `Approvals,${approvals}`,
      `Rejections,${rejections}`,
      `Approval Rate,${approvalRate}%`
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `iecs_system_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             System Intelligence
             <BarChart3 size={24} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Advanced ROI and operational efficiency metrics.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800 shadow-inner">
              {['7D', '30D', '90D'].map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    dateRange === range ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
           </div>
           <Button variant="outline" className="gap-2 bg-slate-900/50 border-slate-800 hover:border-slate-600" onClick={exportToCSV}>
             <Download size={16} />
             Export CSV
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="p-6 bg-slate-900/40 border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Cluster Volume</p>
               <h4 className="text-3xl font-black text-white italic tracking-tight">{totalVolume}</h4>
               <div className="mt-4 flex items-center gap-2 text-emerald-400">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Live context sync active</span>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all text-primary-500">
               <Zap size={100} />
            </div>
         </Card>
         <Card className="p-6 bg-slate-900/40 border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Approval Rate</p>
               <h4 className="text-3xl font-black text-white italic tracking-tight">{approvalRate}%</h4>
               <div className="mt-4 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Optimal Pipeline</span>
               </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all text-secondary-500">
               <BarChart3 size={100} />
            </div>
         </Card>
         <Card className="p-6 bg-slate-900/40 border-slate-800 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Pending Queue</p>
               <h4 className="text-3xl font-black text-white italic tracking-tight">{pending}</h4>
               <div className="mt-4 flex items-center gap-2 text-orange-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{pending > 5 ? 'High throughput' : 'Stable throughput'}</span>
               </div>
            </div>
         </Card>
         <Card className="p-6 bg-primary-500/5 border-primary-500/10 relative overflow-hidden group">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">System Health</p>
               <h4 className="text-3xl font-black text-white italic tracking-tight">99.9%</h4>
               <div className="mt-4 flex items-center gap-2 text-primary-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Nodes Operational</span>
               </div>
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 border-slate-800 bg-slate-900/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Volume & Approval Trends</h3>
               <Badge variant="primary" className="shadow-lg shadow-primary-500/10">LIVE TELEMETRY</Badge>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                     <defs>
                        <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                        dy={10}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#f8fafc' }}
                        labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', fontWeight: '900', textTransform: 'uppercase' }}
                     />
                     <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
                     <Area type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={3} fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         <Card className="p-8 border-slate-800 bg-slate-900/20 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Stage Latency (Hours)</h3>
               <Badge variant="neutral">BOTTLENECK ANALYSIS</Badge>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                     <XAxis type="number" hide />
                     <YAxis 
                        dataKey="stage" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }} 
                        width={120}
                     />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', color: '#f8fafc' }}
                        labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px', fontWeight: '900', textTransform: 'uppercase' }}
                     />
                     <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} shadow="0 0 10px rgba(245, 158, 11, 0.2)" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default SystemIntelligence;
