import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../../context/ApplicationContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  User, 
  DollarSign, 
  Users as UsersIcon, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  Briefcase,
  Home,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { Card, Button, Input } from '../../../components/common/UIComponents';
import Stepper from '../../../components/common/Stepper';

const steps = ['Select Plan', 'Personal Info', 'Income', 'Family', 'Documents', 'Review'];

const Apply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addApplication } = useApplications();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 0
    selectedPlan: '',
    // Step 1
    firstName: user?.username || '', lastName: '', ssn: '', dob: '', address: '', city: '',
    // Step 2
    employerName: '', monthlyIncome: '', otherIncome: '',
    // Step 3
    householdSize: '1', dependents: '0', maritalStatus: 'single',
    // Step 4
    files: []
  });

  const handleSubmit = async () => {
    if (!formData.selectedPlan) {
      setCurrentStep(1);
      return;
    }
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addApplication({
      applicant: `${formData.firstName} ${formData.lastName}`,
      income: parseFloat(formData.monthlyIncome || 0),
      household: parseInt(formData.householdSize || 1),
      plan: formData.selectedPlan,
    });
    
    setIsSubmitting(false);
    navigate('/dashboard/status');
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.selectedPlan) return;
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Select Your Integrated Benefit Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'SNAP', name: 'SNAP Food Assistance', desc: 'Monthly nutritional support for low-income households.', icon: Home, color: 'text-orange-400' },
                { id: 'Medicaid', name: 'Medicaid Universal', desc: 'Comprehensive health coverage for seniors and individuals.', icon: ShieldCheck, color: 'text-emerald-400' },
                { id: 'CCAP', name: 'CCAP Child Care', desc: 'Subsidy for working parents requiring childcare support.', icon: UsersIcon, color: 'text-primary-400' },
                { id: 'QHP', name: 'QHP Standard Health', desc: 'Qualified Health Plans with regional tax credit eligibility.', icon: Briefcase, color: 'text-slate-400' },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handleInputChange('selectedPlan', plan.name)}
                  className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                    formData.selectedPlan === plan.name 
                      ? 'bg-primary-500/10 border-primary-500/40 ring-1 ring-primary-500/40' 
                      : 'bg-slate-900/20 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 transition-colors ${formData.selectedPlan === plan.name ? plan.color : 'text-slate-600'}`}>
                      <plan.icon size={24} />
                    </div>
                    <div>
                      <h4 className={`font-black uppercase tracking-tight mb-1 transition-colors ${formData.selectedPlan === plan.name ? 'text-white' : 'text-slate-400'}`}>{plan.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{plan.desc}</p>
                    </div>
                  </div>
                  {formData.selectedPlan === plan.name && (
                    <motion.div layoutId="plan-check" className="absolute right-4 top-4 text-primary-500">
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="John" />
              <Input label="Last Name" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Doe" />
              <Input label="Social Security Number (SSN)" value={formData.ssn} onChange={(e) => handleInputChange('ssn', e.target.value)} placeholder="000-00-0000" />
              <Input label="Date of Birth" type="date" value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} />
            </div>
            <Input label="Full Address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="123 Main St, Apt 4" />
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <Input label="Employer Name" value={formData.employerName} onChange={(e) => handleInputChange('employerName', e.target.value)} placeholder="Tech Solutions Inc." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Monthly Gross Income" type="number" value={formData.monthlyIncome} onChange={(e) => handleInputChange('monthlyIncome', e.target.value)} placeholder="0.00" />
              <Input label="Other Income (Monthly)" type="number" value={formData.otherIncome} onChange={(e) => handleInputChange('otherIncome', e.target.value)} placeholder="0.00" />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Household Size" type="number" value={formData.householdSize} onChange={(e) => handleInputChange('householdSize', e.target.value)} placeholder="1" />
              <Input label="Number of Dependents" type="number" value={formData.dependents} onChange={(e) => handleInputChange('dependents', e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Marital Status Status</label>
              <select 
                value={formData.maritalStatus} 
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                className="flex h-12 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="single">Single / Individual</option>
                <option value="married">Married / Joint</option>
                <option value="divorced">Separated / Divorced</option>
              </select>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="border-2 border-dashed border-slate-800 rounded-[24px] p-12 text-center hover:border-primary-500/50 transition-all cursor-pointer bg-slate-900/20 group">
               <Upload size={48} className="mx-auto text-slate-700 mb-4 group-hover:text-primary-400 group-hover:scale-110 transition-all" />
               <h4 className="font-black text-white uppercase tracking-widest text-sm">Synchronize Documents</h4>
               <p className="text-[10px] text-slate-500 mt-2 font-black uppercase tracking-tighter">ID Proof, Income Statements, Residence Proof (PDF, PNG, JPG)</p>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <Card className="p-8 bg-slate-900/40 border-slate-800 shadow-inner rounded-[24px]">
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={18} className="text-primary-400" />
                Submission Audit
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Benefit</p>
                  <p className="text-lg font-black text-primary-400 italic tracking-tight">{formData.selectedPlan}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</p>
                  <p className="text-lg font-black text-white italic tracking-tight">{formData.firstName} {formData.lastName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Meta Income</p>
                  <p className="text-lg font-black text-white italic tracking-tight">${formData.monthlyIncome || '0'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Household Vector</p>
                  <p className="text-lg font-black text-white italic tracking-tight">{formData.householdSize || '1'} Member(s)</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight italic">Enroll for Benefits</h1>
        <p className="text-slate-500 mt-2 font-black uppercase tracking-widest text-[10px]">Complete the synchronized audit pipeline to submit your eligibility application.</p>
      </div>

      <div className="mb-12">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      <Card className="p-10 shadow-2xl border-slate-800 bg-slate-900/10 mb-8 overflow-hidden rounded-[32px]">
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-between pt-10 border-t border-slate-800">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="gap-2 bg-slate-900/50 border-slate-700 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={18} />
            Previous Protocol
          </Button>
          
          {currentStep === steps.length ? (
            <Button 
                variant="primary" 
                size="lg" 
                className="px-16 bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest"
                onClick={handleSubmit}
                isLoading={isSubmitting}
            >
              Sync Application
            </Button>
          ) : (
            <Button variant="primary" onClick={nextStep} className="gap-2 px-10 shadow-xl shadow-primary-500/20 font-black uppercase tracking-widest">
              Next Stage
              <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Apply;
