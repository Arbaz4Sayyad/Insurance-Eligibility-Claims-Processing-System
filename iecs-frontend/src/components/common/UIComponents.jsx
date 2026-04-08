import React from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(37,99,235,0.1)] border border-primary-400/20',
    secondary: 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white',
    outline: 'border border-slate-700 bg-transparent text-slate-400 hover:border-slate-500 hover:text-slate-200',
    ghost: 'bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-none',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  };

  const sizes = {
    xs: 'px-2 py-1 text-[10px] font-black uppercase tracking-widest',
    sm: 'px-3 py-1.5 text-xs font-bold leading-none',
    md: 'px-5 py-2.5 text-sm font-semibold',
    lg: 'px-7 py-3.5 text-base font-bold',
  };

  return (
    <motion.button
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      ref={ref}
      disabled={isLoading || props.disabled}
      className={twMerge(
        'inline-flex items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      <span className="flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
});

Button.displayName = 'Button';

const Input = React.forwardRef(({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-2 text-left">
      {label && (
        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none block ml-1 select-none">
          {label}
        </label>
      )}
      <div className="relative group/input w-full">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-primary-500 transition-colors pointer-events-none z-10">
            {React.cloneElement(leftIcon, { size: leftIcon.props.size || 18 })}
          </div>
        )}
        <input
          ref={ref}
          className={twMerge(
            'flex h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2 text-sm text-foreground placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500/50 focus:border-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-slate-900/50',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-red-500/30 focus:ring-red-500/50 focus:border-red-500/30',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover/input:text-slate-400 transition-colors z-10">
            {React.cloneElement(rightIcon, { size: rightIcon.props.size || 18 })}
          </div>
        )}
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</motion.p>}
    </div>
  );
});

Input.displayName = 'Input';

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={twMerge(
        'premium-card bg-slate-900/60 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Badge = ({ children, className, variant = 'neutral' }) => {
  const variants = {
    primary: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
    secondary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span className={twMerge(
      'status-badge border inline-flex px-2.5 py-0.5 text-[10px] uppercase font-black items-center gap-1.5 tracking-tight',
      variants[variant],
      className
    )}>
      {variant !== 'neutral' && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse ring-2 ring-current ring-offset-bg" />}
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white tracking-tight italic uppercase italic">
                {title}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge("animate-pulse rounded-md bg-slate-800/80", className)}
      {...props}
    />
  );
};

export { Button, Input, Card, Badge, Skeleton, Modal };

