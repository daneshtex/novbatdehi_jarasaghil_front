// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { httpTokenJson } from "../shared/api/http";

interface AuthUser {
  id: number;
  name: string;
  mobile: string;
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await httpTokenJson<{
          data: {
            user: {
              id: number;
              name: string;
              mobile: string;
              roles: string[];
              permissions: string[];
            };
          };
          message: string;
        }>("/auth/me");
        setUser({
          id: res.data.user.id,
          name: res.data.user.name,
          mobile: res.data.user.mobile,
          roles: res.data.user.roles || [],
          permissions: res.data.user.permissions || [],
        });
        console.log("permission", res);
      } catch {
        localStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_token");
      } finally {
        setLoading(false);
      }
    };

    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
