import React, { memo, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BuildingOfficeIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { getPriorityColor } from '../../utils/accessibleColors';

const DealCard = memo(({ deal, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: deal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const formattedValue = useMemo(() => {
    if (!deal.value) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(deal.value);
  }, [deal.value]);

  const formattedDate = useMemo(() => {
    if (!deal.closeDate) return null;
    return new Date(deal.closeDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, [deal.closeDate]);

  const isOverdue = useMemo(() => {
    return deal.closeDate && new Date(deal.closeDate) < new Date() && deal.status === 'open';
  }, [deal.closeDate, deal.status]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-grab active:cursor-grabbing
        hover:shadow-md transition-shadow duration-200
        ${isDragging ? 'rotate-2 shadow-lg' : ''}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Deal Title */}
      <div className="mb-3">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {deal.title}
        </h4>
        {deal.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {deal.description}
          </p>
        )}
      </div>

      {/* Deal Value */}
      {deal.value && (
        <div className="flex items-center mb-2">
          <CurrencyDollarIcon className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-sm font-semibold text-green-600">
            {formattedValue}
          </span>
          {deal.probability && (
            <span className="text-xs text-gray-500 ml-2">
              ({deal.probability}%)
            </span>
          )}
        </div>
      )}

      {/* Contact and Company Info */}
      <div className="space-y-1 mb-3">
        {deal.contact && (
          <div className="flex items-center text-xs text-gray-600">
            <UserIcon className="h-3 w-3 mr-1" />
            <span className="truncate">{deal.contact.name}</span>
          </div>
        )}
        {deal.company && (
          <div className="flex items-center text-xs text-gray-600">
            <BuildingOfficeIcon className="h-3 w-3 mr-1" />
            <span className="truncate">{deal.company.name}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Priority Badge */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(deal.priority)}`}>
          {deal.priority}
        </span>

        {/* Close Date */}
        <div className="flex items-center text-xs text-gray-500">
          {isOverdue && (
            <ExclamationCircleIcon className="h-3 w-3 text-red-500 mr-1" />
          )}
          {deal.closeDate && (
            <>
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                {formattedDate}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

DealCard.displayName = 'DealCard';

export default DealCard;