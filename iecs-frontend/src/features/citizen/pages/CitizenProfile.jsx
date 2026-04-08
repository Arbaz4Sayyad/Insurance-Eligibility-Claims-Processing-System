import React from 'react';
import { Card, Button, Input, Badge } from '../../../components/common/UIComponents';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const CitizenProfile = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [profile, setProfile] = React.useState({
    firstName: 'Alexander',
    lastName: 'Wright',
    email: 'citizen@iecs.com',
    phone: '+91 98765 43210',
    address: '123 Enterprise Way, Tech Sector 4',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    ssn: '***-**-9021',
    mfa: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Simulation: show success toast
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Secure Profile
             <UserCircle size={28} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Manage your identity and synchronization settings.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant={isEditing ? 'primary' : 'outline'} 
            className="gap-2"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
           >
             {isEditing ? <CheckCircle2 size={18} /> : null}
             {isEditing ? 'Sync Changes' : 'Edit Profile'}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Profile Card */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 text-center bg-slate-900/40 border-slate-800 relative overflow-hidden group shadow-xl">
               <div className="relative z-10">
                  <div className="relative inline-block mb-6">
                     <div className="w-24 h-24 rounded-[32px] bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-3xl text-primary-500 shadow-2xl group-hover:scale-105 transition-transform">
                        {profile.firstName[0]}{profile.lastName[0]}
                     </div>
                     {isEditing && (
                       <button className="absolute -right-2 -bottom-2 p-2 bg-primary-600 rounded-xl text-white shadow-lg shadow-primary-500/20 hover:scale-110 transition-all">
                          <Camera size={14} />
                       </button>
                     )}
                  </div>
                  <h2 className="text-xl font-black text-white italic tracking-tight">{profile.firstName} {profile.lastName}</h2>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 italic shadow-sm">Citizen Account Active</p>
                  
                  <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Trust Score</span>
                        <span className="text-xs font-black text-emerald-400">98/100</span>
                     </div>
                     <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                     </div>
                  </div>
               </div>
            </Card>

           <Card className="p-6 bg-primary-500/5 border-primary-500/10">
              <h4 className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ShieldCheck size={14} /> Identity Guard
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed italic font-bold">
                "Verified via biometric integration. Your identifiers are masked and synchronized with regional registries."
              </p>
           </Card>
        </div>

         {/* Details Form */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 space-y-8 bg-slate-900/10 border-slate-800 shadow-2xl">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                     <Input 
                       value={profile.firstName} 
                       disabled={!isEditing} 
                       onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                       className="bg-slate-950 border-slate-800 font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                     <Input 
                       value={profile.lastName} 
                       disabled={!isEditing} 
                       onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                       className="bg-slate-950 border-slate-800 font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Protocol</label>
                     <div className="relative">
                        <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <Input 
                         value={profile.email} 
                         disabled={!isEditing} 
                         className="pl-10 bg-slate-950 border-slate-800 font-bold"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Link</label>
                     <div className="relative">
                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <Input 
                         value={profile.phone} 
                         disabled={!isEditing} 
                         className="pl-10 bg-slate-950 border-slate-800 font-bold"
                        />
                     </div>
                  </div>
               </div>

               <div className="pt-4 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Residency Address</label>
                     <div className="relative">
                        <MapPin size={14} className="absolute left-4 top-4 text-slate-600" />
                        <textarea 
                         disabled={!isEditing}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-10 h-24 text-sm text-white focus:border-primary-500/50 outline-none transition-all resize-none font-bold"
                         value={profile.address}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <Card className={`p-4 border-slate-800 flex items-center justify-between transition-all shadow-lg ${profile.mfa ? 'bg-emerald-500/10' : 'bg-slate-950'}`}>
                        <div className="flex items-center gap-3">
                           <Smartphone size={18} className="text-slate-500" />
                           <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">Two-Factor Auth</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Secured via Mobile</p>
                           </div>
                        </div>
                        <Badge variant="success" className="text-[9px] font-black">ACTIVE</Badge>
                     </Card>
                     <Card className="p-4 bg-slate-950 border-slate-800 flex items-center justify-between opacity-50 shadow-lg">
                        <div className="flex items-center gap-3">
                           <CreditCard size={18} className="text-slate-500" />
                           <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">Benefit Card</p>
                              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none mt-1">E-Wallet Enabled</p>
                           </div>
                        </div>
                        <Badge variant="neutral" className="text-[9px] font-black">LOCK</Badge>
                     </Card>
                  </div>
               </div>
            </Card>

            <Card className="p-6 bg-rose-500/5 border-rose-500/10 flex items-center justify-between shadow-xl">
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                     <Lock size={18} />
                  </div>
                  <div>
                     <h4 className="text-xs font-black text-white uppercase tracking-widest">Critical Controls</h4>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">Delete or Suspend account synchronization</p>
                  </div>
               </div>
               <Button variant="ghost" size="xs" className="text-rose-400 font-black tracking-widest text-[10px] uppercase hover:bg-rose-500/10">Initiate Termination</Button>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenProfile;
