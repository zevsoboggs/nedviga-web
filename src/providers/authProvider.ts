import type { AuthProvider } from '@refinedev/core';
import { apiFetch, setToken, getToken } from '../api';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { token } = await apiFetch<{ token: string }>('POST', '/auth/login', { email, password });
      setToken(token);
      return { success: true, redirectTo: '/' };
    } catch (e: any) {
      return {
        success: false,
        error: { name: 'Ошибка входа', message: e?.message ?? 'Неверный email или пароль' },
      };
    }
  },
  logout: async () => {
    setToken(null);
    return { success: true, redirectTo: '/login' };
  },
  check: async () => {
    if (getToken()) {
      try {
        await apiFetch('GET', '/auth/me');
        return { authenticated: true };
      } catch {
        setToken(null);
      }
    }
    return { authenticated: false, redirectTo: '/login' };
  },
  getIdentity: async () => {
    try {
      const { user } = await apiFetch<{ user: any }>('GET', '/auth/me');
      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName ?? ''}`.trim(),
        avatar: user.avatarUrl ?? undefined,
        agency: user.agency?.name,
        role: user.role,
      };
    } catch {
      return null;
    }
  },
  getPermissions: async () => null,
  onError: async (error) => {
    if (error?.status === 401) {
      setToken(null);
      return { logout: true, redirectTo: '/login' };
    }
    return {};
  },
};
