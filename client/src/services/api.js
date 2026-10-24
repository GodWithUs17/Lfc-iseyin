const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('lfc_auth_token');
  const headers = { ...(options.headers || {}) };

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
    localStorage.removeItem('lfc_auth_token');
  }

  return response;
}

export default apiRequest;
export { API_BASE_URL };
