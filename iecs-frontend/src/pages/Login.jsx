import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/common/UIComponents';
import { useAuth } from '../context/AuthContext';
import { authService } from '../features/auth/services/auth.service';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Zap, ArrowRight, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Secure identifier required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid identifier format';

    if (!formData.password) newErrors.password = 'Authentication key required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await authService.login(formData.email, formData.password);
      login(data);
    } catch (err) {
      setErrors({ form: err.message || 'Verification failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 text-primary-500 mb-6 shadow-2xl relative group"
          >
            <Zap size={32} className="relative z-10 fill-current" />
            <div className="absolute inset-0 bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">IECS<span className="text-primary-500">.</span></h1>
          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em]">Secure Access Gateway</p>
        </div>

        <Card className="p-10 bg-slate-900/60 backdrop-blur-2xl border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[32px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence>
              {errors.form && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 text-center flex items-center gap-3"
                >
                  <Shield size={16} className="shrink-0" />
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <Input
                label="Identity Provider"
                type="email"
                placeholder="name@provider.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                className="h-12"
                leftIcon={<Mail />}
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Secret Key</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:text-primary-400 transition-colors leading-none">
                    Reset Access
                  </Link>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  className="h-12"
                  leftIcon={<Lock />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-white transition-colors flex items-center justify-center h-full"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary-500/20 border-none relative overflow-hidden group"
              isLoading={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Authorize Access
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] font-bold text-slate-600 uppercase tracking-widest">
            New Citizen?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 transition-colors">
              Create Vault
            </Link>
          </p>
        </Card>

        {/* Sandbox Credentials (Interactive Premium Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 p-6 bg-slate-900/40 border border-slate-800/50 rounded-[28px] backdrop-blur-sm shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-primary-500/5 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-5 border-b border-slate-800/50 pb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sandbox Vault</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Click any identity to pre-fill access</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
             {[
               { role: 'Administrator', email: 'admin@iecs.com', icon: 'zap' },
               { role: 'Caseworker', email: 'caseworker@iecs.com', icon: 'shield' },
               { role: 'Citizen Account', email: 'citizen@iecs.com', icon: 'mail' }
             ].map((cred) => (
               <button 
                 key={cred.role} 
                 type="button"
                 onClick={() => setFormData({ email: cred.email, password: 'password' })}
                 className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/30 hover:border-primary-500/50 hover:bg-slate-950/80 transition-all group/cred"
               >
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-slate-500 group-hover/cred:text-primary-400 uppercase tracking-wider transition-colors">{cred.role}</span>
                    <span className="text-[11px] font-black text-slate-300 group-hover/cred:text-white font-mono transition-colors">{cred.email}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900 text-slate-600 group-hover/cred:text-primary-500 group-hover/cred:bg-primary-500/10 transition-all">
                    <Zap size={12} className={cred.icon === 'zap' ? 'fill-current' : ''} />
                  </div>
               </button>
             ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/50 flex items-center justify-center gap-2">
             <div className="w-1 h-1 rounded-full bg-slate-700 animate-pulse" />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Master Secret: password</span>
             <div className="w-1 h-1 rounded-full bg-slate-700 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>
    </div>

  );
};

export default LoginPage;

