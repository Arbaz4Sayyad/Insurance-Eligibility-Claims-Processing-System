import React from 'react';
import { Card, Button, Badge } from '../../../components/common/UIComponents';
import { 
  CreditCard, 
  Send, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Landmark
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useApplications } from '../../../context/ApplicationContext';

const BenefitDisbursement = () => {
  const [activeTab, setActiveTab] = React.useState('PENDING');
  const { applications } = useApplications();
  const [localDeployments, setLocalDeployments] = React.useState([]);

  React.useEffect(() => {
    const initial = applications
      .filter(app => app.status === 'APPROVED')
      .map(app => ({
        id: `PAY-${app.id.split('-')[1] || app.id}`,
        recipient: app.applicant,
        plan: app.plan?.split(' ')[0] || 'GENERAL',
        amount: app.plan?.includes('SNAP') ? 450 : 
                app.plan?.includes('Medicaid') ? 1200 :
                app.plan?.includes('CCAP') ? 800 : 250,
        status: 'PENDING',
        date: new Date().toISOString().split('T')[0]
      }));
    setLocalDeployments(initial);
  }, [applications]);

  const handleInitiate = (id) => {
    setLocalDeployments(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'COMPLETED' } : d
    ));
    setActiveTab('COMPLETED');
  };

  const handleMassDisbursement = () => {
    setLocalDeployments(prev => prev.map(d => 
      d.status === 'PENDING' ? { ...d, status: 'COMPLETED' } : d
    ));
    setActiveTab('COMPLETED');
  };

  const currentTabItems = localDeployments.filter(d => d.status === activeTab);

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Benefit Issuance
             <CreditCard size={28} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium italic">Execute and audit regional subsidy disbursements.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            variant="primary" 
            className="gap-2 shadow-primary-500/20"
            onClick={handleMassDisbursement}
            disabled={localDeployments.filter(d => d.status === 'PENDING').length === 0}
           >
              <Landmark size={18} />
              Mass Disbursement
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-neutral-900/40 border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
               <TrendingUp size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total Disbursed (Month)</p>
               <h4 className="text-2xl font-black text-white">
                 ₹{(localDeployments.filter(d => d.status === 'COMPLETED').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
               </h4>
            </div>
         </Card>
      </div>

      <Card className="p-0 overflow-hidden border-white/5 bg-neutral-900/10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <h3 className="text-sm font-black text-white uppercase tracking-widest">Deployment Pipeline</h3>
           <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/5">
              {['PENDING', 'SCHEDULED', 'COMPLETED'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    activeTab === tab ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-neutral-600 uppercase tracking-widest bg-neutral-950/50">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Benefit Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentTabItems.map(d => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5 font-black text-white text-xs">{d.id}</td>
                  <td className="px-6 py-5 font-bold text-neutral-400 text-xs">{d.recipient}</td>
                  <td className="px-6 py-5">
                     <Badge variant="neutral">{d.plan}</Badge>
                  </td>
                  <td className="px-6 py-5 font-black text-white italic">₹{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-right pr-8">
                     {activeTab === 'PENDING' ? (
                       <Button 
                        variant="ghost" 
                        size="xs" 
                        className="gap-2 group-hover:text-primary-400 font-black tracking-widest text-[10px] uppercase"
                        onClick={() => handleInitiate(d.id)}
                       >
                          Initiate
                          <ArrowRight size={12} />
                       </Button>
                     ) : (
                       <Badge variant="success">LOGGED</Badge>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentTabItems.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center opacity-30 italic">
               <CheckCircle2 size={48} className="mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">No {activeTab.toLowerCase()} transactions</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BenefitDisbursement;
