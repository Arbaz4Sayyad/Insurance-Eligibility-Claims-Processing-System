import React from 'react';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Globe, 
  RefreshCw,
  AlertTriangle,
  History,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/apiClient';
import { toast } from 'react-hot-toast';

const SecuritySync = () => {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastAudit, setLastAudit] = React.useState('2 hours ago');
  
  const [sessions] = React.useState([
    { id: 1, device: 'Chrome on Windows 11', location: 'Tech City, India', active: true, ip: '192.168.1.45' },
    { id: 2, device: 'IECS Mobile App', location: 'Current Location', active: true, ip: 'Mobile Network' },
  ]);

  const handleSync = async () => {
    if (!user?.id) return;
    try {
      setIsSyncing(true);
      const res = await api.put(`/users/${user.id}/security-sync`);
      if (res.success) {
        toast.success(res.message || 'Security Keys Synchronized');
        setLastAudit('Just now');
      }
    } catch (err) {
      toast.error(err.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Security & Sync
             <ShieldCheck size={28} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Manage cryptographic keys and active sessions.</p>
        </div>
        <Button 
          variant="primary" 
          className="gap-2 shadow-primary-500/20"
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Synchronizing keys...' : 'Security Sync'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Status */}
          <Card className="p-8 bg-slate-900/10 border-slate-800">
             <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <ShieldCheck size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">System Integrity: Optimal</h3>
                      <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1">Last full audit: Just now</p>
                   </div>
                </div>
                <Badge variant="success" className="font-black tracking-widest">VERIFIED</Badge>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-slate-950 border-slate-800 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Fingerprint size={18} className="text-primary-400" />
                      <span className="text-xs font-black text-white uppercase tracking-tight">Biometric Link</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Identity linked to regional biometric registry for rapid synchronization.</p>
                   <Button variant="outline" size="xs" className="w-full text-[9px] font-black uppercase tracking-widest">Update Link</Button>
                </Card>
                <Card className="p-4 bg-slate-950 border-slate-800 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Lock size={18} className="text-amber-400" />
                      <span className="text-xs font-black text-white uppercase tracking-tight">Encryption Keys</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">AES-256 session keys are rotated every 24 hours. Next rotation: 4h 12m.</p>
                   <Button variant="outline" size="xs" className="w-full text-[9px] font-black uppercase tracking-widest">Rotate Now</Button>
                </Card>
             </div>
          </Card>

          {/* Active Sessions */}
          <Card className="p-0 overflow-hidden border-slate-800 bg-slate-900/10">
             <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                   <Globe size={16} className="text-primary-500" />
                   Active Sessions
                </h3>
             </div>
             <div className="divide-y divide-slate-800">
                {sessions.map(s => (
                   <div key={s.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                            {s.device.includes('Mobile') ? <Smartphone size={18} /> : <AlertTriangle size={18} />}
                         </div>
                         <div>
                            <p className="text-sm font-black text-white capitalize">{s.device}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.location} • {s.ip}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         {s.active && <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[8px] font-black text-emerald-500 uppercase">Current</span>
                         </div>}
                         <Button variant="ghost" size="xs" className="text-rose-500 font-black tracking-widest text-[9px] uppercase hover:bg-rose-500/10">Terminate</Button>
                      </div>
                   </div>
                ))}
             </div>
          </Card>
        </div>

        {/* Info & Side */}
        <div className="space-y-6">
           <Card className="p-6 bg-primary-500/5 border-primary-500/10">
              <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ShieldCheck size={14} /> Security Protocol
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed italic font-bold mb-4">
                "Security Sync ensures your local session state is cryptographically aligned with the central identity provider."
              </p>
              <div className="space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Key Strength</span>
                    <span className="text-white">4096-bit</span>
                 </div>
                 <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 w-full" />
                 </div>
              </div>
           </Card>

           <Card className="p-6 bg-slate-900 border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <History size={14} /> Audit Trail
              </h4>
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                       <div className="w-[2px] bg-slate-800 relative">
                          <div className="absolute top-2 -left-[3px] w-2 h-2 rounded-full bg-slate-700" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-tight">Security Sync Performed</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">2 hours ago</p>
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

export default SecuritySync;
