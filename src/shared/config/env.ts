export type AppEnv = {
  mode: string;
  apiBaseUrl: string;
};

export function getEnv(): AppEnv {
  const mode = (import.meta as any).env?.MODE || "development";

  // در حالت development از /api استفاده کن (پروکسی Vite)
  // در production از آدرس واقعی
  const apiBaseUrl = import.meta.env.DEV
    ? "/api" // استفاده از proxy در توسعه
    : import.meta.env.VITE_API_BASE_URL || "http://192.168.43.129:8000/api/";

  return { mode, apiBaseUrl };
}
