import { useState } from "react";
import {
  API_ENDPOINTS,
  type ErrorResponse,
  type SuccessResponse,
} from "@project_goldenrod/shared";

const isErrorResponse = (
  response: SuccessResponse<unknown> | ErrorResponse,
): response is ErrorResponse => {
  return (response as ErrorResponse).errors !== undefined;
};

export const request =
  <Req, Res>(endPoint: keyof typeof API_ENDPOINTS) =>
  async (payload: Req): Promise<SuccessResponse<Res>> => {
    try {
      const response = await fetch(
        `http://localhost:3000${API_ENDPOINTS[endPoint]}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const json = (await response.json()) as
        | SuccessResponse<Res>
        | ErrorResponse;

      if (!response.ok) {
        if (isErrorResponse(json)) {
          throw new Error(
            `${json.status}: ${json.errors.map(({ message }) => message).join(", ")}`,
          );
        } else {
          throw new Error(`Error: ${response.statusText}`);
        }
      }

      return json as SuccessResponse<Res>;
    } catch (error) {
      throw new Error(
        `${endPoint} failed: ${(error as Error)?.message || "Unknown Error"}`,
      );
    }
  };

export const useRequest = <Req, Res>(endPoint: keyof typeof API_ENDPOINTS) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const makeRequest = async (
    payload: Req,
  ): Promise<SuccessResponse<Res> | ErrorResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await request<Req, Res>(endPoint)(payload);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { makeRequest, loading, error };
};
