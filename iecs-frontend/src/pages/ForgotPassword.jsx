import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/common/UIComponents';
import { authService } from '../features/auth/services/auth.service';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-secondary-50 dark:bg-secondary-950 items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <Card className="p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
              <CheckCircle2 size={32} />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Check your email</h1>
            <p className="text-secondary-600 dark:text-secondary-400 mb-8">
              We've sent password reset instructions to <b>{email}</b>.
            </p>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary-50 dark:bg-secondary-950 items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-secondary-600 hover:text-primary-600">
            <ArrowLeft size={16} className="mr-2" />
            Back to Login
          </Link>
        </div>

        <Card className="p-8 shadow-xl border-secondary-200 dark:border-secondary-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 mb-4">
              <KeyRound size={28} />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Forgot Password?</h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-2">No worries, we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                className="pl-10"
              />
              <Mail className="absolute left-3 top-[38px] text-secondary-400" size={18} />
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              size="lg"
            >
              Reset Password
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
