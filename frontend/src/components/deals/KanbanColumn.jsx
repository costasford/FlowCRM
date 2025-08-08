import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DealCard from './DealCard';

const KanbanColumn = ({
  id,
  title,
  color,
  headerColor,
  deals,
  count,
  totalValue,
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-lg">
      {/* Column Header */}
      <div className={`${headerColor} text-white px-4 py-3 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs mt-1 opacity-90">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`${color} min-h-[500px] p-3 rounded-b-lg flex-1`}
      >
        <SortableContext items={deals.map(deal => deal.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
            
            {deals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No deals in this stage</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;