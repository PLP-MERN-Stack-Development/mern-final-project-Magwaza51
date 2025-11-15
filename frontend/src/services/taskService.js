import api from './api';

const taskService = {
  // Get all tasks
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Get tasks by project
  getProjectTasks: async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
  },

  // Get task by ID
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Add comment to task
  addComment: async (taskId, text) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  }
};

export default taskService;
