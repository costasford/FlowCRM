import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/deals/KanbanBoard';
import NewDealModal from '../components/deals/NewDealModal';
import { dealsAPI } from '../utils/api';
import { PlusIcon, TableCellsIcon, Squares2X2Icon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Deals = () => {
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await dealsAPI.getAll();
      setDeals(response.deals || []);
    } catch (error) {
      console.error('Failed to fetch deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStageColor = (stage) => {
    const colors = {
      lead: 'bg-gray-100 text-gray-800',
      qualified: 'bg-blue-100 text-blue-800',
      proposal: 'bg-yellow-100 text-yellow-800',
      negotiation: 'bg-orange-100 text-orange-800',
      closed: 'bg-green-100 text-green-800',
      lost: 'bg-red-100 text-red-800',
    };
    return colors[stage] || colors.lead;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
          <p className="text-gray-600">Track your property management deals and leases</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="Kanban View"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title="List View"
            >
              <TableCellsIcon className="h-5 w-5" />
            </button>
          </div>

          {/* New Deal Button */}
          <button
            onClick={() => setShowNewDealModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Deal
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <KanbanBoard />
      ) : (
        <div className="card">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12">
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No deals</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first deal.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Close Date
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {deal.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {deal.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deal.contact?.name || 'No contact'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {deal.contact?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(deal.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deal.expectedCloseDate 
                          ? new Date(deal.expectedCloseDate).toLocaleDateString()
                          : 'Not set'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New Deal Modal */}
      {showNewDealModal && (
        <NewDealModal
          isOpen={showNewDealModal}
          onClose={() => setShowNewDealModal(false)}
          onSuccess={() => {
            setShowNewDealModal(false);
            // Refresh the kanban board
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default Deals;