import React from 'react';
import { Card, Button, Input } from '../../../components/common/UIComponents';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RejectionModal = ({ isOpen, onClose, onSubmit, appId }) => {
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('A mandatory justification is required for system rejection.');
      return;
    }
    onSubmit(appId, reason);
    setReason('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                    <ShieldAlert size={24} />
                 </div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tight">Final Rejection</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-neutral-500 transition-all"
              >
                <X size={20} />
              </button>
           </div>

           <div className="space-y-6">
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex gap-3">
                 <AlertCircle className="text-orange-400 shrink-0" size={18} />
                 <p className="text-xs text-orange-400 font-bold leading-relaxed">
                   CRITICAL: You are overriding the system workflow for application <span className="text-white">#{appId}</span>. All rejections generate a legal notice to the applicant.
                 </p>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Rejection Justification</label>
                 <textarea 
                   value={reason}
                   onChange={(e) => {
                     setReason(e.target.value);
                     if (error) setError('');
                   }}
                   className="w-full h-32 bg-neutral-950 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-red-500/50 outline-none transition-all resize-none"
                   placeholder="Enter detailed audit reason... (e.g., Missing PAYSTUB_MAR.pdf)"
                 />
                 {error && (
                   <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-1">{error}</p>
                 )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                 <Button 
                   variant="outline" 
                   className="flex-1 order-2 sm:order-1"
                   onClick={onClose}
                 >
                   Cancel Action
                 </Button>
                 <Button 
                   variant="primary" 
                   className="flex-1 bg-red-600 hover:bg-red-500 order-1 sm:order-2 shadow-lg shadow-red-500/20"
                   onClick={handleConfirm}
                 >
                   Confirm Rejection
                 </Button>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RejectionModal;
