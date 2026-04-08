import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Skeleton } from '../../../components/common/UIComponents';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ShieldCheck, 
  ExternalLink,
  Power,
  X,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialPlans = [
  { id: 1, name: 'Medical Assistance (MA)', category: 'Healthcare', status: 'Active', startDate: '2026-01-01', endDate: '2026-12-31', members: 4500 },
  { id: 2, name: 'Food Support (SNAP)', category: 'Nutrition', status: 'Active', startDate: '2026-02-15', endDate: '2027-02-14', members: 3200 },
  { id: 3, name: 'Cash Assistance (TANF)', category: 'Financial', status: 'Inactive', startDate: '2025-06-01', endDate: '2026-05-31', members: 0 },
  { id: 4, name: 'Housing Support', category: 'Housing', status: 'Active', startDate: '2026-03-01', endDate: '2027-02-28', members: 1200 },
];

const PlansManagement = () => {
  const [plans, setPlans] = useState(initialPlans);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPlan, setNewPlan] = useState({ name: '', category: 'Healthcare', status: 'Active', startDate: '', endDate: '' });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleStatus = (id) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id 
        ? { ...plan, status: plan.status === 'Active' ? 'Inactive' : 'Active' } 
        : plan
    ));
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setNewPlan({ ...plan });
    setIsModalOpen(true);
  };

  const savePlan = () => {
    if (!newPlan.name) return;
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...newPlan } : p));
    } else {
      setPlans(prev => [...prev, { ...newPlan, id: Date.now(), members: 0 }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    setNewPlan({ name: '', category: 'Healthcare', status: 'Active', startDate: '', endDate: '' });
  };

  const filteredPlans = plans.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Benefit Plans</h1>
          <p className="text-neutral-500 mt-1 font-medium">Configure and monitor system-wide insurance programs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-primary-500/20 px-6">
          <Plus size={18} />
          Launch New Plan
        </Button>
      </div>

      {/* Control Bar */}
      <Card className="p-4 bg-neutral-900/30 border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input 
            type="text" 
            placeholder="Search plans or categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0c] border border-white/5 rounded-xl outline-none text-sm text-white focus:border-primary-500/50 transition-all placeholder:text-neutral-600"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-neutral-900/50">
            <Filter size={16} />
            Advanced Filter
          </Button>
        </div>
      </Card>

      {/* Plans Table */}
      <Card className="p-0 overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-neutral-900/40 text-neutral-500 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                <th className="px-6 py-5">Sr. No</th>
                <th className="px-6 py-5">Plan Identification</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right px-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredPlans.map((plan, index) => (
                  <motion.tr 
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-neutral-600">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center border border-primary-500/20">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                            {plan.name}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-medium">#{plan.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="neutral" className="bg-neutral-900/50 border-white/5">
                        {plan.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-xs text-neutral-300 font-medium">Starts: <span className="text-neutral-500">{plan.startDate}</span></p>
                        <p className="text-xs text-neutral-300 font-medium">Ends: <span className="text-neutral-500">{plan.endDate}</span></p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={plan.status === 'Active' ? 'success' : 'danger'}>
                        {plan.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right px-10">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => handleEdit(plan)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          title="Edit Details"
                         >
                           <Edit2 size={16} />
                         </button>
                         <button 
                          onClick={() => toggleStatus(plan.id)}
                          className={`p-2 rounded-lg transition-all ${
                            plan.status === 'Active' ? 'text-orange-500 hover:bg-orange-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'
                          }`}
                          title={plan.status === 'Active' ? 'Deactivate (Soft Delete)' : 'Reactivate'}
                         >
                           <Power size={16} />
                         </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-sm"
            />
            
            <motion.div 
              layoutId="plan-modal"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-neutral-900 border border-white/5 rounded-3xl shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-white">{editingPlan ? 'Refine Benefit Plan' : 'Configure New Plan'}</h3>
                  <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest font-bold">Plan Management Interface</p>
                </div>
                <button onClick={closeModal} className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <Input 
                  label="Official Designation" 
                  value={newPlan.name} 
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="e.g. Healthcare Premium Access" 
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    type="date" 
                    label="Effective Start" 
                    value={newPlan.startDate}
                    onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
                  />
                  <Input 
                    type="date" 
                    label="Projected End" 
                    value={newPlan.endDate}
                    onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block ml-1">Plan Category</label>
                  <select 
                    value={newPlan.category}
                    onChange={(e) => setNewPlan({...newPlan, category: e.target.value})}
                    className="flex h-11 w-full rounded-xl border border-white/5 bg-[#0a0a0c] px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Financial">Financial Assistance</option>
                    <option value="Housing">Housing Support</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="ghost" className="flex-1" onClick={closeModal}>Discard</Button>
                  <Button className="flex-1 shadow-primary-500/20" onClick={savePlan}>
                    {editingPlan ? 'Update Plan' : 'Finalize & Launch'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlansManagement;

