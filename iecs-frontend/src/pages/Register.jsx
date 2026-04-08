import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/common/UIComponents';
import { authService } from '../features/auth/services/auth.service';
import { UserPlus, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.register(formData);
      // Redirect to login on success
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary-50 dark:bg-secondary-950 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        <Card className="p-8 shadow-xl border-secondary-200 dark:border-secondary-800">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <UserPlus size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Citizen Registration</h1>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Create your IECS account to apply for benefits</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30 text-center">
                {errors.form}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={errors.fullName}
                  className="pl-10"
                />
                <User className="absolute left-3 top-[38px] text-secondary-400" size={18} />
              </div>
              <div className="relative">
                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
                <Phone className="absolute left-3 top-[38px] text-secondary-400" size={18} />
              </div>
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                className="pl-10"
              />
              <Mail className="absolute left-3 top-[38px] text-secondary-400" size={18} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-[38px] text-secondary-400" size={18} />
              </div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  error={errors.confirmPassword}
                  className="pl-10"
                />
                <Lock className="absolute left-3 top-[38px] text-secondary-400" size={18} />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                size="lg"
              >
                Create Account
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-secondary-500 dark:text-secondary-500">
            By clicking "Create Account", you agree to our{' '}
            <a href="#" className="underline hover:text-primary-600">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-primary-600">Privacy Policy</a>.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
