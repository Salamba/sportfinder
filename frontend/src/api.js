// Определяем базовый URL для API
const BASE = import.meta.env.PROD 
  ? 'https://sportfinder-backend.onrender.com/api'  // ← Замени на свой URL на Render
  : '/api';

function getToken() {
  return localStorage.getItem('sf_token');
}

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isForm && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new Error((data && data.error) || `Ошибка запроса: ${res.status}`);
  }
  return data;
}

// ✅ ЭКСПОРТИРУЕМ api ОБЪЕКТ
export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),

  me: () => request('/users/me'),
  updateMe: (payload) => request('/users/me', { method: 'PATCH', body: payload }),
  uploadMyPhoto: (formData) => request('/users/me/photo', { method: 'POST', body: formData, isForm: true }),

  sports: () => request('/sports'),

  events: (query = '') => request(`/events${query}`),
  event: (id) => request(`/events/${id}`),
  createEvent: (payload) => request('/events', { method: 'POST', body: payload }),
  uploadEventPhoto: (id, formData) => request(`/events/${id}/photo`, { method: 'POST', body: formData, isForm: true }),
  joinEvent: (id) => request(`/events/${id}/join`, { method: 'POST' }),
  leaveEvent: (id) => request(`/events/${id}/leave`, { method: 'POST' }),
  cancelEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),

  clubs: () => request('/clubs'),
  club: (id) => request(`/clubs/${id}`),
  createClub: (payload) => request('/clubs', { method: 'POST', body: payload }),
  joinClub: (id) => request(`/clubs/${id}/join`, { method: 'POST' }),

  threads: () => request('/threads'),
  messages: (threadId) => request(`/threads/${threadId}/messages`),
  sendMessage: (threadId, body) => request(`/threads/${threadId}/messages`, { method: 'POST', body: { body } }),
};

// ✅ ЭКСПОРТИРУЕМ getToken ДЛЯ ИСПОЛЬЗОВАНИЯ В ДРУГИХ ФАЙЛАХ
export { getToken };