import React from 'react';
import { Card, Badge } from '../../../components/common/UIComponents';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Zap, 
  ShieldCheck, 
  XCircle,
  ArrowDown
} from 'lucide-react';
import { motion } from 'framer-motion';

const AppReviewHistory = ({ history }) => {
  const getIcon = (action) => {
    switch (action) {
      case 'APPLICATION_SUBMITTED': return <FileText size={16} />;
      case 'DATA_COLLECTED': return <Zap size={16} />;
      case 'ELIGIBILITY_PENDING': return <Clock size={16} />;
      case 'ELIGIBLE': return <CheckCircle2 size={16} />;
      case 'NOT_ELIGIBLE': return <XCircle size={16} />;
      case 'APPROVED': return <ShieldCheck size={16} />;
      case 'REJECTED': return <XCircle size={16} />;
      default: return <History size={16} />;
    }
  };

  const getColor = (action) => {
    if (action.includes('APPROVED') || action.includes('ELIGIBLE')) return 'text-emerald-400 bg-emerald-500/10';
    if (action.includes('REJECTED') || action.includes('NOT')) return 'text-red-400 bg-red-500/10';
    if (action.includes('PENDING')) return 'text-primary-400 bg-primary-500/10';
    return 'text-neutral-500 bg-neutral-500/10';
  };

  return (
    <Card className="p-8 bg-neutral-900/40 border-white/5 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-10">
         <div className="p-2 rounded-xl bg-primary-500/10 text-primary-400">
            <History size={20} />
         </div>
         <h3 className="text-sm font-black text-white uppercase tracking-widest">Audit Lifecycle</h3>
      </div>

      <div className="space-y-0 relative">
        <div className="absolute left-[39px] top-2 bottom-2 w-px bg-white/5" />
        
        {history.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-6 pb-10 last:pb-0 relative group"
          >
            <div className={`z-10 w-20 flex flex-col items-center gap-1`}>
               <div className={`w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 ${getColor(item.action)}`}>
                  {getIcon(item.action)}
               </div>
               <span className="text-[10px] font-black text-neutral-600 uppercase tracking-tighter text-center leading-tight">
                 {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
               </span>
            </div>

            <div className="flex-1 pt-0.5">
               <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-white uppercase tracking-tight tracking-widest">
                    {item.action.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] italic">
                    By {item.actor}
                  </span>
               </div>
               <div className="p-4 rounded-2xl bg-neutral-950/50 border border-white/[0.02] group-hover:border-primary-500/20 transition-all">
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    {item.note || 'Process transaction recorded successfully by system kernel.'}
                  </p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default AppReviewHistory;
