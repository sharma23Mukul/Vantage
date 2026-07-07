/**
 * Thin fetch wrapper for the Vantage API.
 * Reads base URL from Vite env (VITE_API_URL) or defaults to localhost:8000.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore parse errors
    }
    throw new ApiError(
      `API error: ${response.status} ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // 202 Accepted (analytics) — no body expected
  if (response.status === 202) {
    return { status: 'accepted' };
  }

  return response.json();
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

export { ApiError };
