import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard } from '../../hooks/useDashboard';
import * as api from '../../utils/api';

// Mock the API modules
jest.mock('../../utils/api');

describe('useDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    api.contactsAPI.getAll.mockResolvedValue({
      pagination: { totalCount: 100 }
    });
    api.companiesAPI.getAll.mockResolvedValue({
      pagination: { totalCount: 25 }
    });
    api.dealsAPI.getPipeline.mockResolvedValue({
      stats: { totalDeals: 50, totalValue: 500000 },
      pipeline: []
    });
    api.tasksAPI.getDashboard.mockResolvedValue({
      stats: { pending: 10, overdue: 2, dueSoon: 5 },
      recentTasks: []
    });
    api.dealsAPI.getAll.mockResolvedValue({ deals: [] });
    api.activitiesAPI.getTimeline.mockResolvedValue({ activities: [] });
  });

  test('should initialize with loading state', () => {
    const { result } = renderHook(() => useDashboard());

    expect(result.current.loading.stats).toBe(true);
    expect(result.current.loading.tasks).toBe(true);
    expect(result.current.stats.totalContacts).toBe(0);
  });

  test('should fetch and return dashboard data', async () => {
    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading.stats).toBe(false);
    });

    expect(result.current.stats.totalContacts).toBe(100);
    expect(result.current.stats.totalCompanies).toBe(25);
    expect(result.current.stats.totalDeals).toBe(50);
    expect(result.current.stats.totalDealValue).toBe(500000);
  });

  test('should handle API errors gracefully', async () => {
    api.contactsAPI.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading.stats).toBe(false);
    });

    // Should handle errors without crashing
    expect(result.current.stats.totalContacts).toBe(0);
  });

  test('should set all loading states to false on error', async () => {
    api.contactsAPI.getAll.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useDashboard());

    await waitFor(() => {
      expect(result.current.loading.stats).toBe(false);
      expect(result.current.loading.tasks).toBe(false);
      expect(result.current.loading.contacts).toBe(false);
      expect(result.current.loading.deals).toBe(false);
      expect(result.current.loading.activities).toBe(false);
      expect(result.current.loading.pipeline).toBe(false);
    });
  });
});