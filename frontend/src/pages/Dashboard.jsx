import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI, dealsAPI, contactsAPI } from '../utils/api';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalDealValue: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    dueSoonTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard statistics
        const [contactsResponse, pipelineResponse, tasksResponse] = await Promise.all([
          contactsAPI.getAll({ limit: 1 }),
          dealsAPI.getPipeline(),
          tasksAPI.getDashboard(),
        ]);

        setStats({
          totalContacts: contactsResponse.pagination.totalCount,
          totalDeals: pipelineResponse.stats.totalDeals,
          totalDealValue: pipelineResponse.stats.totalValue,
          pendingTasks: tasksResponse.stats.pending,
          overdueTasks: tasksResponse.stats.overdue,
          dueSoonTasks: tasksResponse.stats.dueSoon,
        });

        setRecentTasks(tasksResponse.recentTasks || []);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={UsersIcon}
          color="blue"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals}
          icon={CurrencyDollarIcon}
          color="green"
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

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
          <a
            href="/tasks"
            className="text-sm text-primary-600 hover:text-primary-900"
          >
            View all
          </a>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No recent tasks</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    {task.contact && (
                      <span className="mr-4">Contact: {task.contact.name}</span>
                    )}
                    {task.deal && (
                      <span className="mr-4">Deal: {task.deal.title}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      Due {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/contacts"
            className="flex items-center p-3 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
          >
            <UsersIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-3 text-sm font-medium text-primary-900">Add Contact</span>
          </a>
          <a
            href="/companies"
            className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
          >
            <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            <span className="ml-3 text-sm font-medium text-green-900">Add Property</span>
          </a>
          <a
            href="/deals"
            className="flex items-center p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
          >
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            <span className="ml-3 text-sm font-medium text-yellow-900">New Deal</span>
          </a>
          <a
            href="/tasks"
            className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
            <span className="ml-3 text-sm font-medium text-purple-900">Create Task</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;