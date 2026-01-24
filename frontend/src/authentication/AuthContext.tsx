import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import {
  API_ENDPOINTS,
  type SuccessResponse,
  type User,
} from "@project_goldenrod/shared";

const AuthContext = createContext<{
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  login: (user: User) => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  isAuthenticating: false,
  login: () => {
    throw new Error("Login function not implemented");
  },
  logout: () => {
    throw new Error("Logout function not implemented");
  },
});

/**
 * Authentication provider component that manages user authentication state and operations.
 *
 * This component wraps the application to provide authentication context to child
 * components. It handles token verification on mount, manages authentication state,
 * and provides login/logout functionality.
 *
 * @component
 * @param {PropsWithChildren<unknown>} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to the auth context
 *
 * @remarks
 * - On mount, verifies existing auth token from localStorage
 * - Automatically clears invalid tokens
 * - Provides `isAuthenticated`, `isAuthenticating`, `login`, and `logout` via context
 * - Stores auth token and user data in localStorage
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      setIsAuthenticating(true);

      fetch(`http://localhost:3000${API_ENDPOINTS.VERIFY_TOKEN}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          return response.json();
        })
        .then((res: SuccessResponse<{ valid: boolean }>) => {
          setIsAuthenticated(res.data.valid);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    }
  }, []);

  // HANDLERS
  const logout = useCallback(() => {
    localStorage.clear();
    setIsAuthenticated(false);
    // probably redirect to login page ... or modal.
  }, []);

  const login = useCallback(({ token, ...user }: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAuthenticating, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);

// Add An Auth Context
//   - Child components should check the context and make no requests until auth is confirmed
//   - This will prevent flickering on protected routes
//   - See: https://reactjs.org/docs/context.html
// If auth fails
//   - Render the login modal over the screen
//   - On successful login, re-render the protected route children
//   - On failed login
