import React from 'react';

interface ToggleSegmentProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function ToggleSegment({ options, selected, onChange }: ToggleSegmentProps) {
  return (
    <div className="flex w-full p-1 bg-gray-100 rounded-xl">
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-[#EF4444] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
