import type { DataProvider } from '@refinedev/core';
import { apiFetch, API_URL } from '../api';

// Сопоставление ресурса Refine с путём и ключами обёртки нашего API.
const RES: Record<string, { path: string; list: string; one: string }> = {
  properties: { path: '/properties', list: 'properties', one: 'property' },
  clients: { path: '/clients', list: 'clients', one: 'client' },
  deals: { path: '/deals', list: 'deals', one: 'deal' },
  tasks: { path: '/tasks', list: 'tasks', one: 'task' },
  staff: { path: '/staff', list: 'users', one: 'user' },
};

const cfg = (resource: string) => RES[resource] ?? { path: `/${resource}`, list: resource, one: resource };

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource }) => {
    const c = cfg(resource);
    const res = await apiFetch<any>('GET', c.path);
    const data = res[c.list] ?? [];
    return { data, total: data.length };
  },

  getOne: async ({ resource, id }) => {
    const c = cfg(resource);
    const res = await apiFetch<any>('GET', `${c.path}/${id}`);
    return { data: res[c.one] ?? res };
  },

  create: async ({ resource, variables }) => {
    const c = cfg(resource);
    const res = await apiFetch<any>('POST', c.path, variables);
    return { data: res[c.one] ?? res };
  },

  update: async ({ resource, id, variables }) => {
    const c = cfg(resource);
    const res = await apiFetch<any>('PATCH', `${c.path}/${id}`, variables);
    return { data: res[c.one] ?? res };
  },

  deleteOne: async ({ resource, id }) => {
    const c = cfg(resource);
    await apiFetch<any>('DELETE', `${c.path}/${id}`);
    return { data: { id } as any };
  },

  getMany: async ({ resource, ids }) => {
    const c = cfg(resource);
    const res = await apiFetch<any>('GET', c.path);
    const all: any[] = res[c.list] ?? [];
    return { data: all.filter((r) => ids.map(String).includes(String(r.id))) };
  },

  custom: async ({ url, method, payload }) => {
    const path = url.startsWith('/api/v1') ? url.replace('/api/v1', '') : url;
    const res = await apiFetch<any>((method ?? 'get').toUpperCase(), path, payload);
    return { data: res };
  },
};
