export const getToken = () => {
  return localStorage.getItem('isAuthenticated') === 'true' ? 'true' : null;
};

export const setToken = (token) => {
  // We do not store the actual sensitive JWT token in localStorage to protect against XSS.
  // Instead, we only store a non-sensitive flag, as the actual auth is handled by secure HTTP-only cookies.
  localStorage.setItem('isAuthenticated', 'true');
};

export const removeToken = () => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};
