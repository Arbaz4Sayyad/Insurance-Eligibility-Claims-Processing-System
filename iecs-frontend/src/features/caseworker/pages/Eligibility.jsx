import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Input, Modal } from '../../../components/common/UIComponents';
import { useApplications } from '../../../context/ApplicationContext';
import { evaluateEligibility } from '../../../utils/eligibilityEngine';
import { 
  ArrowLeft, 
  Brain, 
  CheckCircle2, 
  X, 
  User, 
  DollarSign, 
  Home, 
  AlertTriangle,
  FileText,
  BadgeCheck,
  ShieldCheck,
  History
} from 'lucide-react';
import { motion } from 'framer-motion';

const Eligibility = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications, updateApplicationStatus } = useApplications();
  
  const app = React.useMemo(() => {
    return state?.app || applications.find(a => a.id === id) || { 
      id, 
      applicant: 'Manual Review', 
      income: 0, 
      household: 1, 
      plan: 'Medical Care', 
      status: 'Pending',
      history: []
    };
  }, [state, id, applications]);

  const [decision, setDecision] = useState(null);
  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const evaluation = React.useMemo(() => {
    if (!app) return null;
    return evaluateEligibility(app);
  }, [app]);

  const handleDecision = (type, reason = '') => {
    setDecision(type);
    const finalStatus = type === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const finalNote = reason || comment || (type === 'APPROVE' ? 'Approved based on eligibility criteria' : 'Rejected manually');
    
    // Update global context
    updateApplicationStatus(app.id, finalStatus, finalNote, 'Caseworker');
    
    setTimeout(() => {
      navigate('/caseworker/dashboard');
    }, 1000);
  };

  const openRejectModal = () => setIsRejectModalOpen(true);
  const closeRejectModal = () => setIsRejectModalOpen(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/caseworker/dashboard')} 
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Electronic Determination</span>
              <div className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{app.id}</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
              Eligibility <span className="text-primary-500">Engine</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Queue Priority</p>
            <p className="text-sm font-black text-emerald-400 uppercase tracking-tight leading-none">High / Urgent</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary-500 shadow-xl">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Applicant Data */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-10 bg-slate-900/40 border-slate-800/50 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <FileText size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-800/50">
                <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/20">
                  <User size={20} />
                </div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-wider">Applicant Telemetry</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                 {[
                   { label: 'Secondary ID', value: app.applicant, icon: User },
                   { label: 'Assigned Plan', value: app.plan, icon: BadgeCheck, color: 'text-primary-400' },
                   { label: 'Monthly Delta', value: `$${app.income.toLocaleString()}`, icon: DollarSign },
                   { label: 'Co-habitants', value: `${app.household} Members`, icon: Home }
                 ].map((item, i) => (
                   <div key={i} className="group/item">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 group-hover/item:text-slate-400 transition-colors">{item.label}</p>
                     <div className={`flex items-center gap-3 text-lg font-black tracking-tight ${item.color || 'text-white'}`}>
                        <item.icon size={18} className="text-slate-600 group-hover/item:text-primary-500 transition-colors" />
                        {item.value}
                     </div>
                   </div>
                 ))}
              </div>

              <div className="mt-16 space-y-4">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document Validation</p>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">All Verified</span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {['ID_PROOF.pdf', 'PAYSTUB_MAR.pdf', 'RENT_AGREEMENT.pdf'].map((doc, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between group cursor-pointer hover:border-primary-500/50 transition-all">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors truncate pr-2">{doc}</span>
                       <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <CheckCircle2 size={12} />
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-8 bg-slate-900/20 border-slate-800">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
                  <FileText size={18} />
                </div>
                <h4 className="text-sm font-black text-white uppercase italic">Internal Review Notes</h4>
             </div>
             <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all min-h-[160px] placeholder:text-slate-700"
              placeholder="Inject manual justification for decision..."
             ></textarea>
          </Card>
        </div>

        {/* Right: Recommendation & Decision */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className={`p-8 border-none relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
              evaluation?.status === 'APPROVE' ? 'bg-primary-600' : 'bg-amber-600'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Brain size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase tracking-tight leading-none mb-1">SysEval Recommendation</h4>
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Confidence: {evaluation?.status === 'APPROVE' ? '98.4%' : 'High Manual Risk'}</p>
                  </div>
                </div>
                
                <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 mb-8">
                  <p className="text-sm font-bold text-white italic leading-relaxed">
                    "{evaluation?.reason || 'System is analyzing eligibility coefficients...'}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 px-1">
                  <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ${
                    evaluation?.status === 'APPROVE' ? 'bg-emerald-400 animate-pulse' : 'bg-white animate-pulse'
                  }`}></div>
                  <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                    Result: {evaluation?.status === 'APPROVE' ? 'ELIGIBLE' : 'PENDING REVIEW'}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <Card className="p-8 bg-slate-950 border-slate-800 shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center mb-8">Manual Authorization</h4>
            
            <div className="space-y-4">
              <Button 
                variant="primary" 
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 border-none shadow-lg shadow-emerald-900/20 text-white font-black uppercase tracking-widest text-xs gap-3"
                isLoading={decision === 'APPROVE'}
                onClick={() => handleDecision('APPROVE')}
              >
                <CheckCircle2 size={20} />
                Approve Benefit
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-16 border-slate-800 bg-slate-900/50 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-500 font-black uppercase tracking-widest text-xs transition-all gap-3"
                isLoading={decision === 'REJECT'}
                onClick={openRejectModal}
              >
                <X size={20} />
                Reject Application
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-800/50">
               <div className="flex items-center gap-3 text-slate-500 mb-2">
                 <History size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Status Flow History</span>
               </div>
               <div className="space-y-3">
                 {app.history?.slice(-2).map((h, i) => (
                   <div key={i} className="flex gap-3">
                     <div className="w-0.5 bg-slate-800 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-700" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{h.status}</p>
                       <p className="text-[9px] text-slate-600 font-medium">By {h.actor || 'System'} • {new Date(h.date).toLocaleDateString()}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={closeRejectModal}
        title="Application Rejection"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={24} />
            <div>
              <p className="text-xs font-bold text-red-500 leading-relaxed uppercase tracking-tight">Requirement: Manual Justification</p>
              <p className="text-[10px] text-red-400/80 mt-1 uppercase tracking-tight">You must provide a legal reason for denial before finalizing.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Denial Reason Code</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-300 focus:ring-2 focus:ring-red-500/50 outline-none min-h-[120px] transition-all"
              placeholder="Enter rejection reason (e.g., Income exceeds threshold)..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 h-12 border-slate-800" 
              onClick={closeRejectModal}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-12 bg-red-600 hover:bg-red-500 border-none text-white font-black uppercase tracking-widest text-xs" 
              disabled={!rejectReason.trim()}
              onClick={() => {
                handleDecision('REJECT', rejectReason);
                closeRejectModal();
              }}
            >
              Finalize Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Eligibility;
