'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={`w-full ${className}`}>
      {/* Progress Info */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">
          Pergunta {current} de {total}
        </span>
        <span className="text-sm font-semibold text-blue-400">
          {percentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Glow Effect */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-300 rounded-full opacity-50 blur-sm transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: total }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= current;
          const isCurrent = stepNumber === current;
          
          return (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isCompleted 
                  ? 'bg-blue-500 scale-110' 
                  : isCurrent 
                    ? 'bg-blue-400 scale-125 animate-pulse' 
                    : 'bg-gray-700'
                }
              `}
            />
          );
        })}
      </div>
    </div>
  );
}