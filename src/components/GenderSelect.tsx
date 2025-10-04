'use client';

import { User, Users } from 'lucide-react';

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md">
      <button
        onClick={() => onChange('male')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
          value === 'male'
            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <User className="w-12 h-12" />
          <span className="font-semibold">Masculino</span>
        </div>
      </button>
      
      <button
        onClick={() => onChange('female')}
        className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
          value === 'female'
            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
            : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Users className="w-12 h-12" />
          <span className="font-semibold">Feminino</span>
        </div>
      </button>
    </div>
  );
}