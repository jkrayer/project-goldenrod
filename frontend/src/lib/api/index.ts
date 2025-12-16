import { API_ENDPOINTS, type User } from "@project_goldenrod/shared";

type SuccessResponse<T> = {
  status: number;
  statusText: string;
  success: true;
  data: T;
};

type ErrorResponse = {
  status: number;
  statusText: string;
  success: false;
  error: { messages: string[] };
};

export const register = async (
  email: string,
  username: string,
  password: string,
): Promise<SuccessResponse<User> | ErrorResponse> => {
  try {
    const response = await fetch(
      `http://localhost:3000${API_ENDPOINTS.register}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      },
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: unknown) {
    throw new Error(
      `Login failed: ${(error as Error)?.message || "Unknown Error"}`,
    );
  }
};
