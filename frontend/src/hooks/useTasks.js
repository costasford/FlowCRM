import { useState, useEffect } from 'react';
import { tasksAPI } from '../utils/api';
import { usePermissions } from './usePermissions';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { canViewAllRecords, userId } = usePermissions();

  const fetchTasks = async () => {
    try {
      // For agents, only fetch their own tasks if they can't view all
      const params = canViewAllRecords('tasks') ? {} : { userId };
      const response = await tasksAPI.getAll(params);
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      await tasksAPI.complete(taskId);
      // Update the local state
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
          : task
      ));
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  };

  const createTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData);
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      await tasksAPI.update(taskId, taskData);
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId);
      await fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [canViewAllRecords, userId]);

  return {
    tasks,
    loading,
    completeTask,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};