"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ReactNode } from "react";
import { civicWatchApi, type ApiOrganization, type ApiUser } from "@/lib/api";

const TOKEN_KEY = "civicwatch_token";
const ORGANIZATION_KEY = "civicwatch_organization_id";

interface AuthContextValue {
  token: string | null;
  user: ApiUser | null;
  organizations: ApiOrganization[];
  selectedOrganizationId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectOrganization: (organizationId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((nextToken: string, nextUser: ApiUser) => {
    const storedOrganizationId = window.localStorage.getItem(ORGANIZATION_KEY);
    const fallbackOrganizationId = nextUser.organizations[0]?.id ?? null;
    const validStoredOrganizationId = nextUser.organizations.some(
      (organization) => organization.id === storedOrganizationId
    )
      ? storedOrganizationId
      : null;

    window.localStorage.setItem(TOKEN_KEY, nextToken);
    if (validStoredOrganizationId ?? fallbackOrganizationId) {
      window.localStorage.setItem(ORGANIZATION_KEY, validStoredOrganizationId ?? fallbackOrganizationId!);
    }

    setToken(nextToken);
    setUser(nextUser);
    setSelectedOrganizationId(validStoredOrganizationId ?? fallbackOrganizationId);
  }, []);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    civicWatchApi
      .me(storedToken)
      .then((response) => applySession(storedToken, response.user))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(ORGANIZATION_KEY);
        setToken(null);
        setUser(null);
        setSelectedOrganizationId(null);
      })
      .finally(() => setLoading(false));
  }, [applySession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await civicWatchApi.login(email, password);
      if (!response.accessToken) {
        throw new Error("Le backend n'a pas retourné de jeton d'accès.");
      }
      applySession(response.accessToken, response.user);
    },
    [applySession]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(ORGANIZATION_KEY);
    setToken(null);
    setUser(null);
    setSelectedOrganizationId(null);
  }, []);

  const selectOrganization = useCallback((organizationId: string) => {
    window.localStorage.setItem(ORGANIZATION_KEY, organizationId);
    setSelectedOrganizationId(organizationId);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      organizations: user?.organizations ?? [],
      selectedOrganizationId,
      loading,
      login,
      logout,
      selectOrganization
    }),
    [loading, login, logout, selectOrganization, selectedOrganizationId, token, user]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }
  return context;
}
