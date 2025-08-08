import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI, dealsAPI, contactsAPI, activitiesAPI, companiesAPI } from '../utils/api';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalDealValue: 0,
    totalCompanies: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [recentDeals, setRecentDeals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [pipelineStats, setPipelineStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics and recent data
        const [
          contactsResponse,
          pipelineResponse,
          tasksResponse,
          companiesResponse,
          recentContactsResponse,
          recentDealsResponse,
          activitiesResponse,
        ] = await Promise.all([
          contactsAPI.getAll({ limit: 1 }),
          dealsAPI.getPipeline(),
          tasksAPI.getDashboard(),
          companiesAPI.getAll({ limit: 1 }),
          contactsAPI.getAll({ limit: 5, sort: 'createdAt', order: 'desc' }),
          dealsAPI.getAll({ limit: 5, sort: 'createdAt', order: 'desc' }),
          activitiesAPI.getTimeline({ limit: 5 }),
        ]);

        setStats({
          totalContacts: contactsResponse.pagination?.totalCount || 0,
          totalDeals: pipelineResponse.stats?.totalDeals || 0,
          totalDealValue: pipelineResponse.stats?.totalValue || 0,
          totalCompanies: companiesResponse.pagination?.totalCount || 0,
          pendingTasks: tasksResponse.stats?.pending || 0,
          overdueTasks: tasksResponse.stats?.overdue || 0,
          dueSoonTasks: tasksResponse.stats?.dueSoon || 0,
        });

        setRecentTasks(tasksResponse.recentTasks || []);
        setRecentContacts(recentContactsResponse.contacts || []);
        setRecentDeals(recentDealsResponse.deals || []);
        setRecentActivities(activitiesResponse.activities || []);
        setPipelineStats(pipelineResponse.pipeline || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || colors.medium;
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: PhoneIcon,
      email: EnvelopeIcon,
      meeting: UsersIcon,
      note: ChatBubbleLeftIcon,
      task: ClockIcon,
    };
    return icons[type] || ChatBubbleLeftIcon;
  };

  const getActivityColorLight = (type) => {
    const colors = {
      call: 'bg-blue-100 text-blue-600',
      email: 'bg-green-100 text-green-600',
      meeting: 'bg-purple-100 text-purple-600',
      note: 'bg-gray-100 text-gray-600',
      task: 'bg-orange-100 text-orange-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Properties"
          value={stats.totalCompanies}
          icon={BuildingOfficeIcon}
          color="green"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals}
          icon={CurrencyDollarIcon}
          color="yellow"
          subtitle={formatCurrency(stats.totalDealValue)}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={ClipboardDocumentListIcon}
          color="purple"
        />
      </div>

      {/* Alert Cards */}
      {(stats.overdueTasks > 0 || stats.dueSoonTasks > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.overdueTasks > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Overdue Tasks
                  </h3>
                  <p className="text-sm text-red-700">
                    You have {stats.overdueTasks} overdue {stats.overdueTasks === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {stats.dueSoonTasks > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Due Soon
                  </h3>
                  <p className="text-sm text-yellow-700">
                    {stats.dueSoonTasks} {stats.dueSoonTasks === 1 ? 'task is' : 'tasks are'} due within 7 days
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Tasks */}
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
          
          {recentTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClipboardDocumentListIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm">No recent tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.slice(0, 4).map((task) => (
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
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
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

        {/* Recent Contacts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Contacts</h2>
            <Link
              to="/contacts"
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              View all
            </Link>
          </div>
          
          {recentContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UsersIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm">No recent contacts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.slice(0, 4).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {contact.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {contact.company?.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Deals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Deals</h2>
            <Link
              to="/deals"
              className="text-sm text-blue-600 hover:text-blue-900"
            >
              View all
            </Link>
          </div>
          
          {recentDeals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CurrencyDollarIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm">No recent deals</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentDeals.slice(0, 4).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                    <p className="text-xs text-gray-500">{deal.contact?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(deal.value)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{deal.stage}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
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
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getActivityColorLight(activity.type)}`}>
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
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/contacts"
            className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
          >
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-sm font-medium text-blue-900">Add Contact</span>
          </Link>
          <Link
            to="/companies"
            className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            <span className="ml-3 text-sm font-medium text-green-900">Add Property</span>
          </Link>
          <Link
            to="/deals"
            className="flex items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
          >
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            <span className="ml-3 text-sm font-medium text-yellow-900">New Deal</span>
          </Link>
          <Link
            to="/tasks"
            className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
            <span className="ml-3 text-sm font-medium text-purple-900">Create Task</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;