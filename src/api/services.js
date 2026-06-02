import client from './client.js';

export const loginApi = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (email, password) => {
  const response = await client.post('/auth/register', { email, password });
  return response.data;
};


export const getAgentsApi = async () => {
  const response = await client.get('/agents');
  return response.data;
};

export const addAgentApi = async (agentData) => {
  const response = await client.post('/agents', agentData);
  return response.data;
};

export const updateAgentApi = async ({ id, agentData }) => {
  const response = await client.put(`/agents/${id}`, agentData);
  return response.data;
};

export const deleteAgentApi = async (id) => {
  const response = await client.delete(`/agents/${id}`);
  return response.data;
};


export const uploadTasksApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/tasks/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getTasksGroupedApi = async () => {
  const response = await client.get('/tasks/grouped');
  return response.data;
};

export const getStatsApi = async () => {
  const response = await client.get('/tasks/stats');
  return response.data;
};

export const completeTaskApi = async (id) => {
  const response = await client.patch(`/tasks/${id}/complete`);
  return response.data;
};

export const deleteTaskApi = async (id) => {
  const response = await client.delete(`/tasks/${id}`);
  return response.data;
};

