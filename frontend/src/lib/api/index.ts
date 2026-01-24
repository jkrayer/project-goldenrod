import {
  API_ENDPOINTS,
  type ErrorResponse,
  type SuccessResponse,
  type Session,
} from "@project_goldenrod/shared";

// GET FROM PROCESS
const BASE_URL = `http://localhost:3000`;

const isErrorResponse = (
  response: SuccessResponse<unknown> | ErrorResponse,
): response is ErrorResponse => {
  return (response as ErrorResponse).errors !== undefined;
};

export const getSession = async (sessionId: string): Promise<Session> => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(
    `${BASE_URL}${API_ENDPOINTS.SESSION.replace(":id", sessionId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const json = (await response.json()) as
    | SuccessResponse<Session>
    | ErrorResponse;

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  if (isErrorResponse(json)) {
    throw new Error(
      `${json.status}: ${json.errors.map(({ message }) => message).join(", ")}`,
    );
  } else {
    return json.data as Session;
  }
};

// app.get(API_ENDPOINTS.SESSION, authenticateToken, controllers.sessions.getById);

// export const register = async (
//   email: string,
//   username: string,
//   password: string,
// ): Promise<SuccessResponse<User> | ErrorResponse> => {
//   try {
//     const response = await fetch(
//       `http://localhost:3000${API_ENDPOINTS.register}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, username }),
//       },
//     );

//     if (!response.ok) {
//       throw new Error(`Error: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error: unknown) {
//     throw new Error(
//       `Login failed: ${(error as Error)?.message || "Unknown Error"}`,
//     );
//   }
// };
