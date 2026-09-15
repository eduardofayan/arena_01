const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('arena01_token');

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Erro de requisição');
  }

  return response.json();
}

export function getApiUrl() {
  return API_URL;
}
