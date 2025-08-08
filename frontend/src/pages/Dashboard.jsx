import React, { useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import {
  UsersIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

// Dashboard components
import StatCard from '../components/dashboard/StatCard';
import AlertCards from '../components/dashboard/AlertCards';
import RecentTasks from '../components/dashboard/RecentTasks';
import RecentContacts from '../components/dashboard/RecentContacts';
import RecentDeals from '../components/dashboard/RecentDeals';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';
import SectionErrorBoundary from '../components/common/SectionErrorBoundary';
import AsyncErrorBoundary from '../components/common/AsyncErrorBoundary';

const Dashboard = () => {
  const { user } = useAuth();
  const {
    stats,
    recentTasks,
    recentContacts,
    recentDeals,
    recentActivities,
    pipelineStats,
    loading
  } = useDashboard();

  // Utility functions

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);




  const formatTimeAgo = useCallback((dateString) => {
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
  }, []);

  // Memoize expensive calculations
  const recentTasksSliced = useMemo(() => 
    recentTasks.slice(0, 4), [recentTasks]
  );

  const recentContactsSliced = useMemo(() => 
    recentContacts.slice(0, 4), [recentContacts]
  );

  const recentDealsSliced = useMemo(() => 
    recentDeals.slice(0, 4), [recentDeals]
  );

  const recentActivitiesSliced = useMemo(() => 
    recentActivities.slice(0, 4), [recentActivities]
  );

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
      <AsyncErrorBoundary operation="loading dashboard statistics" size="small">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SectionErrorBoundary section="Total Contacts" size="small">
            <StatCard
              title="Total Contacts"
              value={stats.totalContacts}
              icon={UsersIcon}
              color="blue"
              loading={loading.stats}
            />
          </SectionErrorBoundary>
          <SectionErrorBoundary section="Properties" size="small">
            <StatCard
              title="Properties"
              value={stats.totalCompanies}
              icon={BuildingOfficeIcon}
              color="green"
              loading={loading.stats}
            />
          </SectionErrorBoundary>
          <SectionErrorBoundary section="Active Deals" size="small">
            <StatCard
              title="Active Deals"
              value={stats.totalDeals}
              icon={CurrencyDollarIcon}
              color="yellow"
              subtitle={formatCurrency(stats.totalDealValue)}
              loading={loading.pipeline}
            />
          </SectionErrorBoundary>
          <SectionErrorBoundary section="Pending Tasks" size="small">
            <StatCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon={ClipboardDocumentListIcon}
              loading={loading.tasks}
              color="purple"
            />
          </SectionErrorBoundary>
        </div>
      </AsyncErrorBoundary>

      {/* Alert Cards */}
      <SectionErrorBoundary section="Task Alerts" size="small">
        <AlertCards stats={stats} />
      </SectionErrorBoundary>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AsyncErrorBoundary operation="loading recent tasks" size="normal">
          <RecentTasks tasks={recentTasksSliced} formatDate={formatDate} />
        </AsyncErrorBoundary>
        <AsyncErrorBoundary operation="loading recent contacts" size="normal">
          <RecentContacts contacts={recentContactsSliced} />
        </AsyncErrorBoundary>
        <AsyncErrorBoundary operation="loading recent deals" size="normal">
          <RecentDeals deals={recentDealsSliced} formatCurrency={formatCurrency} />
        </AsyncErrorBoundary>
        <AsyncErrorBoundary operation="loading recent activities" size="normal">
          <RecentActivities activities={recentActivitiesSliced} formatTimeAgo={formatTimeAgo} />
        </AsyncErrorBoundary>
      </div>

      {/* Quick Actions */}
      <SectionErrorBoundary section="Quick Actions" size="small">
        <QuickActions />
      </SectionErrorBoundary>
    </div>
  );
};

export default Dashboard;