import { STORAGE_KEYS } from '@/config/constants';

// In development, let Vite proxy same-origin /api requests to the local server.
export const API_BASE_URL = import.meta.env.DEV
  ? ''
  : 'https://lfc-iseyin.onrender.com';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  return response;
}
