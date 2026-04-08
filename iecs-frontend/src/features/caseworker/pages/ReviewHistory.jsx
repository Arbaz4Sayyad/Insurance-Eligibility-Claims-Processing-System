import React, { useState } from 'react';
import { Card, Badge } from '../../../components/common/UIComponents';
import { useApplications } from '../../../context/ApplicationContext';
import { 
  History, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewHistory = () => {
  const { applications } = useApplications();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Flatten application history for a global timeline
  const globalHistory = applications.flatMap(app => 
    app.history.map(h => ({
      ...h,
      appId: app.id,
      applicant: app.applicant
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredHistory = globalHistory.filter(item => 
    item.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
            Audit <span className="text-primary-500">History</span>
            <History size={24} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Verbatim timeline of all system and caseworker actions.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
             <input 
               type="text" 
               placeholder="Search Audit Logs..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500/50 w-64"
             />
           </div>
           <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[31px] top-0 bottom-0 w-px bg-slate-800/80" />

        <div className="space-y-12 relative z-10">
          {filteredHistory.map((item, index) => (
            <motion.div 
              key={`${item.appId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-8 group"
            >
              <div className="shrink-0 relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl relative z-10 ${
                  item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-emerald-500/5' :
                  item.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/5' :
                  'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.status === 'APPROVED' ? <CheckCircle2 size={24} /> :
                   item.status === 'REJECTED' ? <XCircle size={24} /> :
                   <ArrowRight size={24} />}
                </div>
              </div>

              <div className="flex-1 pt-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-primary-500 uppercase tracking-widest">{item.appId}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <h3 className="text-lg font-black text-white italic tracking-tight uppercase">
                      Action: {item.status}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       <Clock size={12} />
                       {new Date(item.date).toLocaleString()}
                    </div>
                    <Badge variant={item.actor === 'Caseworker' ? 'primary' : 'neutral'} className="text-[9px]">
                      {item.actor}
                    </Badge>
                  </div>
                </div>

                <Card className="p-6 bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-default">
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Impacted Applicant</p>
                      <p className="text-sm font-black text-slate-300 mb-4">{item.applicant}</p>
                      
                      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Decision Context / Note</p>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                          "{item.note || 'No additional justification provided.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
          {filteredHistory.length === 0 && (
             <div className="flex flex-col items-center justify-center p-20 opacity-50">
                <Search size={32} className="text-slate-600 mb-4" />
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No audit logs found</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;
