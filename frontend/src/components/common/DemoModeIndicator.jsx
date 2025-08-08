import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { isDemoMode } from '../../utils/demoData';

const DemoModeIndicator = () => {
  if (!isDemoMode()) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
        <ExclamationTriangleIcon className="h-5 w-5" />
        <span className="text-sm font-medium">Demo Mode</span>
      </div>
    </div>
  );
};

export default DemoModeIndicator;