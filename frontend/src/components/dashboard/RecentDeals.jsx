import React from 'react';
import { Link } from 'react-router-dom';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const RecentDeals = ({ deals, formatCurrency }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Deals</h2>
        <Link
          to="/deals"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          View all
        </Link>
      </div>
      
      {deals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CurrencyDollarIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm">No recent deals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                <p className="text-xs text-gray-500">{deal.contact?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(deal.value)}
                </p>
                <p className="text-xs text-gray-500 capitalize">{deal.stage}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentDeals;