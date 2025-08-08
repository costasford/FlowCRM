import React, { memo } from 'react';

const StatCard = memo(({ title, value, icon: Icon, color = 'blue', subtitle, loading = false }) => (
  <div className="card">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${loading ? 'bg-gray-200 animate-pulse' : `bg-${color}-100`}`}>
        {loading ? (
          <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
        ) : (
          <Icon className={`h-6 w-6 text-${color}-600`} />
        )}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mt-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        {subtitle && !loading && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {loading && (
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mt-2"></div>
        )}
      </div>
    </div>
  </div>
));

StatCard.displayName = 'StatCard';

export default StatCard;