'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const toggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter(v => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {options.map((option) => {
        const isSelected = value.includes(option);
        return (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-left
              ${isSelected 
                ? 'border-blue-500 bg-blue-500/10 text-white' 
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option}</span>
              {isSelected && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}