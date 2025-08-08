import React, { useState, useEffect } from 'react';
import KanbanBoard from '../components/deals/KanbanBoard';
import NewDealModal from '../components/deals/NewDealModal';
import { dealsAPI } from '../utils/api';
import { PlusIcon, TableCellsIcon, Squares2X2Icon, CurrencyDollarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getStageColor } from '../utils/accessibleColors';

const Deals = () => {
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

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


  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setShowViewModal(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return;
    }
    
    try {
      await dealsAPI.delete(dealId);
      fetchDeals();
    } catch (error) {
      console.error('Failed to delete deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    try {
      // Optimistically update the UI
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.id === dealId 
            ? { ...deal, stage: newStage }
            : deal
        )
      );
      
      // Update the deal stage in the backend
      await dealsAPI.updateStage(dealId, newStage);
    } catch (error) {
      console.error('Failed to update deal stage:', error);
      // Revert the optimistic update on error
      fetchDeals();
    }
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
                        <select
                          value={deal.stage}
                          onChange={(e) => handleStageChange(deal.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full border-0 px-2 py-1 focus:ring-2 focus:ring-blue-500 ${getStageColor(deal.stage)}`}
                        >
                          <option value="lead">New Lead</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal">Proposal Sent</option>
                          <option value="negotiation">Negotiating</option>
                          <option value="closed_won">Won</option>
                          <option value="closed_lost">Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deal.expectedCloseDate 
                          ? new Date(deal.expectedCloseDate).toLocaleDateString()
                          : 'Not set'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDeal(deal)}
                          >
                            View
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleEditDeal(deal)}
                            title="Edit Deal"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteDeal(deal.id)}
                            title="Delete Deal"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* New/Edit Deal Modal */}
      {(showNewDealModal || showEditModal) && (
        <NewDealModal
          isOpen={showNewDealModal || showEditModal}
          onClose={() => {
            setShowNewDealModal(false);
            setShowEditModal(false);
            setSelectedDeal(null);
          }}
          onSuccess={() => {
            setShowNewDealModal(false);
            setShowEditModal(false);
            setSelectedDeal(null);
            // Refresh the deals list
            fetchDeals();
          }}
          editDeal={showEditModal ? selectedDeal : null}
        />
      )}

      {/* View Deal Modal */}
      {showViewModal && selectedDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowViewModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Deal Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deal Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDeal.title}</p>
                  </div>
                  
                  {selectedDeal.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedDeal.description}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Value</label>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCurrency(selectedDeal.value)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                      <select
                        value={selectedDeal.stage}
                        onChange={(e) => {
                          handleStageChange(selectedDeal.id, e.target.value);
                          setSelectedDeal({ ...selectedDeal, stage: e.target.value });
                        }}
                        className={`text-sm font-semibold rounded-md border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${getStageColor(selectedDeal.stage)}`}
                      >
                        <option value="lead">New Lead</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal Sent</option>
                        <option value="negotiation">Negotiating</option>
                        <option value="closed_won">Won</option>
                        <option value="closed_lost">Lost</option>
                      </select>
                    </div>
                  </div>
                  
                  {selectedDeal.contact && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedDeal.contact.name} - {selectedDeal.contact.email}
                      </p>
                    </div>
                  )}
                  
                  {selectedDeal.expectedCloseDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Close Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created</label>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(selectedDeal.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditDeal(selectedDeal);
                  }}
                >
                  Edit Deal
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowViewModal(false);
                    handleDeleteDeal(selectedDeal.id);
                  }}
                >
                  Delete Deal
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;