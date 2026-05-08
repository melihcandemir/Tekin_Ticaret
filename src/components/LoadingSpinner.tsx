import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-[#E2E8CE]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#FF8C00] border-t-transparent animate-spin"></div>
      </div>
      {message && (
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
