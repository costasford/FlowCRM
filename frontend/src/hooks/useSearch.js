import { useState, useMemo, useCallback } from 'react';

/**
 * Generic search and filter hook
 * @param {Array} data - Data to search/filter
 * @param {Object} options - Search configuration
 * @param {Array} options.searchFields - Fields to search in
 * @param {Object} options.filters - Filter functions by key
 */
export const useSearch = (data, options = {}) => {
  const { searchFields = [], filters = {} } = options;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const filteredData = useMemo(() => {
    let result = data;

    // Apply search
    if (searchTerm && searchFields.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue && filters[filterKey]) {
        result = result.filter(item => filters[filterKey](item, filterValue));
      }
    });

    return result;
  }, [data, searchTerm, searchFields, activeFilters, filters]);

  const setFilter = useCallback((key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilter = useCallback((key) => {
    setActiveFilters(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    setFilter,
    clearFilter,
    clearAllFilters,
    filteredData,
    resultCount: filteredData.length
  };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};