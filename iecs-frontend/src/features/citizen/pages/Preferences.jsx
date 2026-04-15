import React from 'react';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { 
  Settings, 
  Bell, 
  Mail, 
  Smartphone, 
  Eye, 
  Moon, 
  Layout, 
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/apiClient';
import { toast } from 'react-hot-toast';

const Preferences = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [prefs, setPrefs] = React.useState({
    emailNotif: true,
    smsNotif: false,
    pushNotif: true,
    density: 'relaxed',
    language: 'English (US)',
    autoSync: true
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await api.put(`/users/${user.id}/profile`, {
        preferences: JSON.stringify(prefs)
      });
      if (response && response.success) {
        toast.success('System Preferences Saved Successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to sync preferences');
      console.error('Failed to save preferences', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             System Preferences
             <Settings size={28} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Tailor your interface and communication protocols.</p>
        </div>
        <Button 
          variant="primary" 
          className="gap-2 shadow-primary-500/20"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? <span className="animate-spin border-2 border-white/20 border-t-white rounded-full w-4 h-4" /> : <CheckCircle2 size={18} />}
          Save Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Notification Channels */}
         <Card className="p-8 space-y-6 bg-slate-900/10 border-slate-800">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
               <Bell size={16} className="text-primary-500" />
               Communication Channels
            </h3>
            
            <div className="space-y-4">
               {[
                 { id: 'emailNotif', label: 'Email Protocol', icon: Mail, desc: 'Official correspondence and claim updates.' },
                 { id: 'smsNotif', label: 'SMS Alerts', icon: Smartphone, desc: 'Urgent mobile notifications for status changes.' },
                 { id: 'pushNotif', label: 'Web Push', icon: Bell, desc: 'Real-time browser notifications for task alerts.' },
               ].map(item => (
                 <div 
                   key={item.id}
                   onClick={() => setPrefs({...prefs, [item.id]: !prefs[item.id]})}
                   className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                     prefs[item.id] ? 'bg-primary-500/10 border-primary-500/30' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                   }`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-xl border ${prefs[item.id] ? 'bg-primary-500/20 border-primary-500/20 text-primary-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                          <item.icon size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-white uppercase tracking-tight">{item.label}</p>
                          <p className="text-[10px] text-slate-500 font-bold leading-none mt-1">{item.desc}</p>
                       </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${prefs[item.id] ? 'bg-primary-500' : 'bg-slate-800'}`}>
                       <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${prefs[item.id] ? 'right-1' : 'left-1'}`} />
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         {/* Interface Settings */}
         <Card className="p-8 space-y-6 bg-slate-900/10 border-slate-800">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
               <Eye size={16} className="text-primary-500" />
               Interface Configuration
            </h3>

            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Density</label>
                  <div className="grid grid-cols-2 gap-2">
                     {['compact', 'relaxed'].map(d => (
                        <button
                          key={d}
                          onClick={() => setPrefs({...prefs, density: d})}
                          className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            prefs.density === d ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                           {d}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
                        <Moon size={18} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">Persistence Theme</p>
                        <p className="text-[10px] text-slate-500 font-bold leading-none mt-1">Professional Dark Mode (Enforced)</p>
                     </div>
                  </div>
                  <Badge variant="neutral" className="text-[9px] font-black">LOCKED</Badge>
               </div>

               <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500">
                        <HardDrive size={18} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">Auto-Cloud Sync</p>
                        <p className="text-[10px] text-slate-500 font-bold leading-none mt-1">Automatic persistence as you work.</p>
                     </div>
                  </div>
                  <div 
                    onClick={() => setPrefs({...prefs, autoSync: !prefs.autoSync})}
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${prefs.autoSync ? 'bg-primary-500' : 'bg-slate-800'}`}
                  >
                     <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${prefs.autoSync ? 'right-1' : 'left-1'}`} />
                  </div>
               </div>
            </div>
         </Card>
      </div>
      
      <Card className="p-6 bg-amber-500/5 border-amber-500/10 flex items-center gap-4">
         <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <Layout size={24} />
         </div>
         <div>
            <h4 className="text-sm font-black text-white uppercase tracking-tight">Legacy Interface Options</h4>
            <p className="text-xs text-neutral-500 font-bold leading-relaxed mt-1">
               Some legacy interface options have been disabled to ensure compliance with the Integrated Eligibility system's modern design standards.
            </p>
         </div>
      </Card>
    </div>
  );
};

export default Preferences;
