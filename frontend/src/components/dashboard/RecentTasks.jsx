import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getPriorityColor } from '../../utils/accessibleColors';

const RecentTasks = ({ tasks, formatDate }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
        <Link
          to="/tasks"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          View all
        </Link>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClipboardDocumentListIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm">No recent tasks</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  {task.contact && (
                    <span className="mr-3">Contact: {task.contact.name}</span>
                  )}
                  {task.deal && (
                    <span className="mr-3">Deal: {task.deal.title}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;