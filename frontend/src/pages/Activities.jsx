import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../utils/api';
import { 
  PlusIcon, 
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await activitiesAPI.getTimeline();
      setActivities(response.activities || []);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    return filterType === 'all' || activity.type === filterType;
  });

  const getActivityIcon = (type) => {
    const icons = {
      call: PhoneIcon,
      email: EnvelopeIcon,
      meeting: UserGroupIcon,
      note: ChatBubbleLeftIcon,
      task: ClockIcon,
      appointment: CalendarIcon,
    };
    const Icon = icons[type] || ChatBubbleLeftIcon;
    return Icon;
  };

  const getActivityColor = (type) => {
    const colors = {
      call: 'bg-blue-100 text-blue-600',
      email: 'bg-green-100 text-green-600',
      meeting: 'bg-purple-100 text-purple-600',
      note: 'bg-gray-100 text-gray-600',
      task: 'bg-orange-100 text-orange-600',
      appointment: 'bg-yellow-100 text-yellow-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const groupActivitiesByDate = (activities) => {
    const grouped = {};
    activities.forEach(activity => {
      const date = new Date(activity.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });
    return grouped;
  };

  const formatDateGroup = (dateString) => {
    const date = new Date(dateString);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    if (dateString === today) {
      return 'Today';
    } else if (dateString === yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track all interactions and activities with your properties and contacts
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Log Activity
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex space-x-4">
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Activities</option>
          <option value="call">Calls</option>
          <option value="email">Emails</option>
          <option value="meeting">Meetings</option>
          <option value="note">Notes</option>
          <option value="task">Tasks</option>
          <option value="appointment">Appointments</option>
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="card">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by logging your first activity.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {Object.entries(groupedActivities)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([dateGroup, dayActivities]) => (
                <li key={dateGroup}>
                  <div className="relative pb-8">
                    <div className="sticky top-0 z-10 bg-white py-2">
                      <h3 className="text-sm font-medium text-gray-900 bg-white px-2 py-1 rounded">
                        {formatDateGroup(dateGroup)}
                      </h3>
                    </div>
                    <ul className="space-y-6">
                      {dayActivities.map((activity, activityIndex) => {
                        const Icon = getActivityIcon(activity.type);
                        const isLast = activityIndex === dayActivities.length - 1;
                        
                        return (
                          <li key={activity.id} className="relative">
                            {!isLast && (
                              <span
                                className="absolute top-8 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityColor(activity.type)}`}>
                                  <Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {activity.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {activity.description}
                                    </p>
                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                      {activity.contact && (
                                        <span className="mr-4">Contact: {activity.contact.name}</span>
                                      )}
                                      {activity.deal && (
                                        <span className="mr-4">Deal: {activity.deal.title}</span>
                                      )}
                                      {activity.user && (
                                        <span>By: {activity.user.name}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 text-xs text-gray-500">
                                    {formatDateTime(activity.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;