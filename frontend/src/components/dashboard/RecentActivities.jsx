import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  UsersIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import { getActivityColorLight } from '../../utils/accessibleColors';

const RecentActivities = ({ activities, formatTimeAgo }) => {
  const getActivityIcon = useCallback((type) => {
    const icons = {
      call: PhoneIcon,
      email: EnvelopeIcon,
      meeting: UsersIcon,
      note: ChatBubbleLeftIcon,
      task: ClockIcon,
    };
    return icons[type] || ChatBubbleLeftIcon;
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
        <Link
          to="/activities"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          View all
        </Link>
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ClockIcon className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${getActivityColorLight(activity.type)}`}>
                    <ActivityIcon className="h-3 w-3" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.contact?.name}</p>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeAgo(activity.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivities;