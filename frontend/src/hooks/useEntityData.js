import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for CRUD operations on entities
 * @param {Object} api - API object with getAll, create, update, delete methods
 * @param {Object} options - Configuration options
 * @param {Object} options.params - Default params for getAll
 * @param {boolean} options.autoFetch - Whether to fetch data on mount
 */
export const useEntityData = (api, options = {}) => {
  const { params = {}, autoFetch = true } = options;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAll({ ...params, ...customParams });
      // Handle different response formats
      const items = response.data || response.items || response[Object.keys(response)[0]] || response;
      setData(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [api, params]);

  const create = useCallback(async (itemData) => {
    try {
      await api.create(itemData);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  }, [api, fetchData]);

  const update = useCallback(async (id, itemData) => {
    try {
      await api.update(id, itemData);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  }, [api, fetchData]);

  const remove = useCallback(async (id) => {
    try {
      await api.delete(id);
      await fetchData(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw error;
    }
  }, [api, fetchData]);

  const optimisticUpdate = useCallback((id, updates) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  }, []);

  const optimisticRemove = useCallback((id) => {
    setData(prevData => prevData.filter(item => item.id !== id));
  }, []);

  const optimisticAdd = useCallback((newItem) => {
    setData(prevData => [newItem, ...prevData]);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refetch: fetchData,
    optimisticUpdate,
    optimisticRemove,
    optimisticAdd
  };
};