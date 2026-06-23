import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'https://carautomotive-api-production.up.railway.app/api';

export const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
