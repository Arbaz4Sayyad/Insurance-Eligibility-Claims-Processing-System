import React, { useState } from 'react';
import { Card, Button, Badge, Input, Modal } from '../../../components/common/UIComponents';
import { 
  Users, 
  UserCheck, 
  Briefcase, 
  Search, 
  Filter, 
  MoreVertical,
  Activity
} from 'lucide-react';
import { useStaff } from '../../../context/StaffContext';

const CaseworkerManagement = () => {
  const { workers, toggleWorkerStatus, addWorker } = useStaff();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');

  const handleOnboard = () => {
    if (newWorkerName.trim()) {
      addWorker(newWorkerName);
      setNewWorkerName('');
      setIsModalOpen(false);
    }
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             Staff Management
             <Users size={24} className="text-primary-500" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium">Coordinate caseworker workloads and system permissions.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="primary" className="gap-2 shadow-primary-500/20" onClick={() => setIsModalOpen(true)}>
             <UserCheck size={18} />
             Onboard Worker
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-neutral-900/40 border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
               <Users size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Total Staff</p>
               <h4 className="text-2xl font-black text-white">{workers.length}</h4>
            </div>
         </Card>
      </div>

      <Card className="p-0 overflow-hidden border-white/5 bg-neutral-900/20">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
           <div className="relative w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={16} />
             <input 
               type="text" 
               placeholder="Search staff..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-white/10 rounded-xl text-xs text-white" 
             />
           </div>
           <Button variant="outline" size="sm" className="gap-2">
             <Filter size={14} />
             Filter
           </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-neutral-500 uppercase tracking-widest bg-neutral-950/50">
                <th className="px-6 py-4">Caseworker</th>
                <th className="px-6 py-4">Workload</th>
                <th className="px-6 py-4">Efficiency</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWorkers.map(worker => (
                <tr key={worker.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-white/5 flex items-center justify-center font-black text-primary-500 uppercase">
                          {worker.name[0]}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white">{worker.name}</p>
                          <p className="text-[10px] text-neutral-600 font-bold uppercase">Last active: {worker.lastActive}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${worker.apps > 30 ? 'text-orange-400' : 'text-emerald-400'}`}>
                         {worker.apps}
                       </span>
                       <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Active Cases</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-neutral-950 rounded-full border border-white/5 overflow-hidden">
                           <div className="h-full bg-primary-500" style={{ width: worker.efficiency }}></div>
                        </div>
                        <span className="text-xs font-black text-white">{worker.efficiency}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                     <Badge variant={worker.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {worker.status}
                     </Badge>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          className={worker.status === 'ACTIVE' ? 'text-red-400' : 'text-emerald-400'}
                          onClick={() => toggleWorkerStatus(worker.id)}
                        >
                           {worker.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="ghost" size="xs" className="p-2">
                           <MoreVertical size={16} />
                        </Button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredWorkers.length === 0 && (
                <tr>
                   <td colSpan="5" className="px-6 py-10 text-center text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
                     No caseworkers found
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Onboard Caseworker">
        <div className="space-y-6">
          <Input 
            label="Full Name" 
            placeholder="Jane Doe" 
            value={newWorkerName}
            onChange={(e) => setNewWorkerName(e.target.value)}
          />
          <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleOnboard}>Provision Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CaseworkerManagement;

