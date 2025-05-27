const API_URL = "http://localhost:8090"; // Base URL of the Spring Boot API

export interface User {
  id: number;
  name: string;
  email: string;
  // other user fields as needed
}

export interface AuthResponse {
  token: string;
  user: User;
  // refreshToken etc. if needed
}

/**
 * Send login request to backend and return the auth response.
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // If credentials are invalid or another error occurred
    throw new Error("Email sau parolă incorecte");
  }

  const data = await response.json();
  return data as AuthResponse;
}
