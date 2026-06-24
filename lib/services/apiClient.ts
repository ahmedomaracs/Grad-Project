import axios from 'axios';

const apiURL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://carautomotive-api-production.up.railway.app/api';

const apiClient = axios.create({
  baseURL: apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor — attach JWT Bearer token on every request.
 * The token is stored in the Zustand persist storage key
 * "automate-auth-storage" → state.token (if present).
 */
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('automate-auth-storage');
      if (raw) {
        const parsed = JSON.parse(raw);
        const token: string | undefined = parsed?.state?.token;
        if (token) {
          config.headers = config.headers ?? {};
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors — unauthenticated request will proceed
    }
  }
  return config;
});

/**
 * Response interceptor — handle expired / invalid sessions gracefully.
 * A 401 clears auth state from localStorage and redirects to /signin.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== 'undefined' &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem('automate-auth-storage');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

