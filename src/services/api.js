import axios from 'axios';

const BASE_URL = 'http://localhost:5130/api';

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL
});

// Attach token automatically to requests (only if token exists)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========== AUTH ========== //
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error.response?.data || { message: 'Login failed' };
  }
};

// ========== ENERGY SUMMARY ========== //
export const getEnergySummary = async (spaceIds, startTime, endTime, groupBy) => {
  try {
    const params = { spaceIds, startTime, endTime };
    if (groupBy) {
      params.groupBy = groupBy;
    }

    const response = await api.get('/MeterReadings/energy-summary', { params });
    return response.data;
  } catch (error) {
    console.error('API Error (energy-summary):', error);
    throw error.response?.data || { message: 'Failed to fetch energy summary' };
  }
};

// ========== SPACE-WISE ENERGY ========== //
export const getSpaceWiseEnergy = async (spaceIds, startTime, endTime) => {
  try {
    const response = await api.get('/MeterReadings/space-wise-energy', {
      params: { spaceIds, startTime, endTime }
    });
    return response.data;
  } catch (error) {
    console.error('API Error (space-wise-energy):', error);
    throw error.response?.data || { message: 'Failed to fetch space-wise energy' };
  }
};

// ========== GET ALL SPACES ========== //
export const getAllSpaces = async () => {
  try {
    const response = await api.get('/spaces');
    return response.data;
  } catch (error) {
    console.error('API Error (getAllSpaces):', error);
    throw error.response?.data || { message: 'Failed to fetch space list' };
  }
};

// POST /api/Sites
export const createSite = async (siteData) => {
  const response = await api.post('/Sites', siteData);
  return response.data;
};

// Get the single site (GET /api/Sites/Single)
export const getSingleSite = async () => {
  const response = await api.get('/Sites/Single');
  return response.data;
};

// Update the site (PUT /api/Sites/{id})
export const updateSite = async (id, siteData) => {
  const response = await api.put(`/Sites/{id}`, siteData);
  return response.data;
};
export default api;