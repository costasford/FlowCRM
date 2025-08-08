import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  return (
    <div className="card">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/contacts"
          className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        >
          <UsersIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-3 text-sm font-medium text-blue-900">Go to Contacts</span>
        </Link>
        <Link
          to="/companies"
          className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
        >
          <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
          <span className="ml-3 text-sm font-medium text-green-900">Go to Properties</span>
        </Link>
        <Link
          to="/deals"
          className="flex items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
        >
          <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
          <span className="ml-3 text-sm font-medium text-yellow-900">Go to Deals</span>
        </Link>
        <Link
          to="/tasks"
          className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
        >
          <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
          <span className="ml-3 text-sm font-medium text-purple-900">Go to Tasks</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;