export type AppEnv = {
  mode: string;
  apiBaseUrl: string;
};

export function getEnv(): AppEnv {
  const mode = (import.meta as any).env?.MODE || 'development';
  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://kamiona.liara.run:8000/api/v1/admin';
  return { mode, apiBaseUrl };
}


