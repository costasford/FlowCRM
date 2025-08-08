import React, { useState } from 'react';
import KanbanBoard from '../components/deals/KanbanBoard';
import NewDealModal from '../components/deals/NewDealModal';
import { PlusIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const Deals = () => {
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

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
          <p className="text-gray-600">List view coming soon...</p>
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