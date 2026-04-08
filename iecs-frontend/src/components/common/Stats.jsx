import React from 'react';
import { Card } from './UIComponents';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const StatCard = ({ title, value, trend, color = 'primary', icon: Icon }) => {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    secondary: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    danger: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <Card className="p-6 transition-all hover:border-slate-700/60 shadow-xl overflow-hidden group">
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white italic tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={twMerge('p-3 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-110', colors[color])}>
          <Icon size={24} />
        </div>
      </div>
      {/* Decorative background flare */}
      <div className={twMerge('absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[40px] opacity-10', colors[color]?.split(' ')?.[1])} />
    </Card>
  );
};


export { StatCard };
