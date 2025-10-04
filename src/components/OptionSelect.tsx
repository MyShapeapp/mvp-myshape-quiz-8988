'use client';

interface OptionSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function OptionSelect({ options, value, onChange }: OptionSelectProps) {
  return (
    <div className="w-full max-w-md space-y-3">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onChange(option)}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
            value === option
              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
              : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800/70'
          }`}
        >
          <span className="font-medium">{option}</span>
        </button>
      ))}
    </div>
  );
}