import client from './client.js';

export const loginApi = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const registerApi = async (username, email, password) => {
  const response = await client.post('/auth/register', { username, email, password });
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
  try {
    const response = await client.post('/tasks/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    });

    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      return {
        success: false,
        isErrorFile: true,
        errorBlob: response.data,
        importedCount: parseInt(response.headers['x-imported-count'] || '0', 10),
        errorCount: parseInt(response.headers['x-error-count'] || '0', 10)
      };
    }

    const text = await response.data.text();
    return JSON.parse(text);
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return {
          success: false,
          isErrorFile: true,
          errorBlob: error.response.data,
          importedCount: parseInt(error.response.headers['x-imported-count'] || '0', 10),
          errorCount: parseInt(error.response.headers['x-error-count'] || '0', 10)
        };
      }
      const text = await error.response.data.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return { success: false, message: 'Server error' };
      }
    }
    throw error;
  }
};

export const downloadTemplateApi = async () => {
  const response = await client.get('/tasks/template', {
    responseType: 'blob'
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

export const logoutApi = async () => {
  const response = await client.post('/auth/logout');
  return response.data;
};

export const checkUsernameApi = async (username) => {
  const response = await client.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
  return response.data;
};

