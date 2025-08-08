import { renderHook, act } from '@testing-library/react';
import { useSearch } from '../../hooks/useSearch';

describe('useSearch', () => {
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@test.com', status: 'active' }
  ];

  const searchFields = ['name', 'email'];
  const filters = {
    status: (item, value) => item.status === value
  };

  test('should return all data initially', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    expect(result.current.filteredData).toEqual(sampleData);
    expect(result.current.resultCount).toBe(3);
  });

  test('should filter data by search term', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    act(() => {
      result.current.setSearchTerm('john');
    });

    expect(result.current.filteredData).toHaveLength(2);
    expect(result.current.filteredData[0].name).toBe('John Doe');
    expect(result.current.filteredData[1].name).toBe('Bob Johnson');
  });

  test('should apply filters correctly', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    act(() => {
      result.current.setFilter('status', 'active');
    });

    expect(result.current.filteredData).toHaveLength(2);
    expect(result.current.filteredData.every(item => item.status === 'active')).toBe(true);
  });

  test('should combine search and filters', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    act(() => {
      result.current.setSearchTerm('john');
      result.current.setFilter('status', 'active');
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].name).toBe('John Doe');
  });

  test('should clear filters', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    act(() => {
      result.current.setFilter('status', 'active');
    });

    expect(result.current.filteredData).toHaveLength(2);

    act(() => {
      result.current.clearFilter('status');
    });

    expect(result.current.filteredData).toHaveLength(3);
  });

  test('should clear all filters and search', () => {
    const { result } = renderHook(() => 
      useSearch(sampleData, { searchFields, filters })
    );

    act(() => {
      result.current.setSearchTerm('john');
      result.current.setFilter('status', 'active');
    });

    expect(result.current.filteredData).toHaveLength(1);

    act(() => {
      result.current.clearAllFilters();
    });

    expect(result.current.filteredData).toHaveLength(3);
    expect(result.current.searchTerm).toBe('');
  });
});