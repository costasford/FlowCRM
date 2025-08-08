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
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    type: 'note',
    title: '',
    description: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      await activitiesAPI.create(formData);
      setShowAddModal(false);
      setFormData({ type: 'note', title: '', description: '' });
      fetchActivities();
    } catch (error) {
      console.error('Failed to create activity:', error);
      setSubmitError(error.userMessage || 'Failed to create activity. Please check your input and try again.');
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
            onClick={() => {
              setSubmitError('');
              setShowAddModal(true);
            }}
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
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowAddModal(true)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Log Activity
              </button>
            </div>
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

      {/* Log Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Log New Activity</h3>
                  
                  {submitError && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <div className="font-medium">Error</div>
                      <div className="text-sm mt-1">{submitError}</div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Activity Type</label>
                      <select
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="call">Phone Call</option>
                        <option value="email">Email</option>
                        <option value="meeting">Meeting</option>
                        <option value="note">Note</option>
                        <option value="task">Task</option>
                        <option value="appointment">Appointment</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title *</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g., Called client about lease terms"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Activity details..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Log Activity
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;