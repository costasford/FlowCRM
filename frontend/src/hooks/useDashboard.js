import { useState, useEffect } from 'react';
import { tasksAPI, dealsAPI, contactsAPI, activitiesAPI, companiesAPI } from '../utils/api';

export const useDashboard = () => {
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
  const [loading, setLoading] = useState({
    stats: true,
    tasks: true,
    contacts: true,
    deals: true,
    activities: true,
    pipeline: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch data in stages for better UX
      try {
        // Fetch stats first (most important)
        const [contactsResponse, companiesResponse] = await Promise.all([
          contactsAPI.getAll({ limit: 1 }),
          companiesAPI.getAll({ limit: 1 }),
        ]);
        
        setLoading(prev => ({ ...prev, stats: false }));

        // Fetch pipeline and tasks data
        const [pipelineResponse, tasksResponse] = await Promise.all([
          dealsAPI.getPipeline(),
          tasksAPI.getDashboard(),
        ]);
        
        setLoading(prev => ({ ...prev, pipeline: false, tasks: false }));

        // Fetch recent data last
        const [recentContactsResponse, recentDealsResponse, activitiesResponse] = await Promise.all([
          contactsAPI.getAll({ limit: 5, sort: 'createdAt', order: 'desc' }),
          dealsAPI.getAll({ limit: 5, sort: 'createdAt', order: 'desc' }),
          activitiesAPI.getTimeline({ limit: 5 }),
        ]);
        
        setLoading(prev => ({ ...prev, contacts: false, deals: false, activities: false }));

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
        // Set all loading states to false on error
        setLoading({
          stats: false,
          tasks: false,
          contacts: false,
          deals: false,
          activities: false,
          pipeline: false
        });
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    recentTasks,
    recentContacts,
    recentDeals,
    recentActivities,
    pipelineStats,
    loading
  };
};