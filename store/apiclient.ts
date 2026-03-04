// apiClient.ts

import { getAuthToken } from "./authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  body?: any; // allow passing objects directly
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const token = getAuthToken();

  const testtoken = localStorage.getItem("auth-storage");
  console.log("API REQUEST TOKEN:", token);

  if (!API_URL) throw new Error("API URL is not defined in .env");
  if (!token) throw new Error("Auth token is missing");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API Error: ${res.status} - ${error}`);
  }

  return res.json() as Promise<T>;
};
