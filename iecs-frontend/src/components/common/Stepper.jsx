import React from 'react';
import { Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0 shadow-inner"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary-600 -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center group">
              <div 
                className={twMerge(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl',
                  isCompleted 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-primary-500/20' 
                    : isActive 
                      ? 'bg-slate-950 border-primary-500 text-primary-500 scale-110' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                )}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{stepNumber}</span>
                )}
              </div>
              
              <div className="absolute -bottom-8 w-max text-center">
                <span className={twMerge(
                  'text-[10px] uppercase font-black tracking-[0.1em] transition-colors duration-300 italic',
                  isActive ? 'text-primary-500' : 'text-slate-600'
                )}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
