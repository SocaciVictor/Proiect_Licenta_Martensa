import * as authService from "@/modules/auth/services/authService";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { LoginRequest, RegisterRequest } from "../../modules/auth/types/auth";

export interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (data: RegisterRequest) => Promise<any>;
  onLogin?: (data: LoginRequest) => Promise<any>;
  onLogout?: () => Promise<void>;
}

const TOKEN_KEY = "my-jwt";
const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: null },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Loaded token:", token);
      if (token) {
        setAuthState({ token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    loadToken();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      setAuthState({ token: response.token, authenticated: true });
      return response;
    } catch (e: any) {
      return {
        error: true,
        msg: e.response?.data?.msg || "Eroare la autentificare",
      };
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      await SecureStore.setItemAsync(TOKEN_KEY, response.token);
      setAuthState({ token: response.token, authenticated: true });
      return response;
    } catch (e: any) {
      return {
        error: true,
        msg: e.response?.data?.msg || "Eroare la înregistrare",
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({ token: null, authenticated: false });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        onLogin: login,
        onRegister: register,
        onLogout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
