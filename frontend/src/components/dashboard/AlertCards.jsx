import React from 'react';
import { ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AlertCards = ({ stats }) => {
  if (stats.overdueTasks === 0 && stats.dueSoonTasks === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {stats.overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Overdue Tasks
              </h3>
              <p className="text-sm text-red-700">
                You have {stats.overdueTasks} overdue {stats.overdueTasks === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {stats.dueSoonTasks > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Due Soon
              </h3>
              <p className="text-sm text-yellow-700">
                {stats.dueSoonTasks} {stats.dueSoonTasks === 1 ? 'task is' : 'tasks are'} due within 7 days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCards;