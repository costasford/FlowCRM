import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';

import KanbanColumn from './KanbanColumn';
import DealCard from './DealCard';
import { dealsAPI } from '../../utils/api';

const DEAL_STAGES = [
  {
    id: 'lead',
    title: 'New Leads',
    color: 'bg-gray-100',
    headerColor: 'bg-gray-500',
  },
  {
    id: 'qualified',
    title: 'Qualified',
    color: 'bg-blue-100',
    headerColor: 'bg-blue-500',
  },
  {
    id: 'proposal',
    title: 'Proposal Sent',
    color: 'bg-yellow-100',
    headerColor: 'bg-yellow-500',
  },
  {
    id: 'negotiation',
    title: 'Negotiating',
    color: 'bg-orange-100',
    headerColor: 'bg-orange-500',
  },
  {
    id: 'closed_won',
    title: 'Won',
    color: 'bg-green-100',
    headerColor: 'bg-green-500',
  },
  {
    id: 'closed_lost',
    title: 'Lost',
    color: 'bg-red-100',
    headerColor: 'bg-red-500',
  },
];

const KanbanBoard = () => {
  const [deals, setDeals] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      setLoading(true);
      const response = await dealsAPI.getPipeline();
      setDeals(response.pipeline);
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to fetch pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setDeals((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      // Find the indexes for the items
      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      let newIndex;
      if (overId in prev) {
        // We're at the root droppable of a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem = over && overIndex < overItems.length - 1;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: prev[activeContainer].filter(
          (item) => item.id !== activeId
        ),
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          { ...prev[activeContainer][activeIndex], stage: overContainer },
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId) || overId;

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    const activeIndex = deals[activeContainer].findIndex(
      (item) => item.id === activeId
    );
    const overIndex = deals[overContainer].findIndex((item) => item.id === overId);

    if (activeContainer === overContainer) {
      const newIndex = overIndex;
      
      setDeals((prev) => ({
        ...prev,
        [overContainer]: arrayMove(prev[overContainer], activeIndex, newIndex),
      }));
    }

    // Update the deal stage in the backend
    if (activeContainer !== overContainer) {
      try {
        await dealsAPI.updateStage(activeId, overContainer);
      } catch (error) {
        console.error('Failed to update deal stage:', error);
        // Revert the change on error
        await fetchPipelineData();
      }
    }

    setActiveId(null);
  };

  const findContainer = (id) => {
    if (id in deals) {
      return id;
    }

    return Object.keys(deals).find((key) =>
      deals[key].some((item) => item.id === id)
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    
    for (const stage of DEAL_STAGES) {
      const deal = deals[stage.id]?.find(item => item.id === activeId);
      if (deal) return deal;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Total Deals</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalDeals || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalValue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.avgDealSize || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-600">Win Rate</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalDeals > 0 
              ? Math.round(((deals.closed_won?.length || 0) / stats.totalDeals) * 100) 
              : 0}%
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {DEAL_STAGES.map((stage) => (
            <SortableContext
              key={stage.id}
              items={deals[stage.id]?.map(deal => deal.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={stage.id}
                title={stage.title}
                color={stage.color}
                headerColor={stage.headerColor}
                deals={deals[stage.id] || []}
                count={deals[stage.id]?.length || 0}
                totalValue={
                  deals[stage.id]?.reduce((sum, deal) => 
                    sum + (parseFloat(deal.value) || 0), 0
                  ) || 0
                }
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeId ? <DealCard deal={getActiveItem()} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;