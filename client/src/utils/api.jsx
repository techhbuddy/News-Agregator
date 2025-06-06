import { getToken } from './auth';

const BASE_URL = 'http://localhost:5000/api';

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const getProtectedData = async () => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/protected-route`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
