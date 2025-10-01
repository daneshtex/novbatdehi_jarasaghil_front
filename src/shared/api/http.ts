import { getEnv } from '../config/env';

export type ApiErrorInfo = { message: string; status?: number; code?: string };

type HttpErrorLike = { response?: { status: number; data?: any }; code?: string; message?: string };

export function getBaseUrl(): string {
  return getEnv().apiBaseUrl;
}

export function getErrorInfo(error: unknown): ApiErrorInfo {
  const err = error as HttpErrorLike;

  if (!err.response) {
    if ((err as any)?.code === 'ECONNABORTED') {
      return { message: 'پاسخ‌گویی سرور بیش از حد طول کشید', code: 'TIMEOUT' };
    }
    return { message: 'اتصال شما به اینترنت برقرار نیست', code: (err as any)?.code };
  }

  const status = err.response.status;
  const data = err.response.data as any;
  const serverMessage = (typeof data === 'string' ? data : undefined) || data?.message || data?.error || data?.detail;

  if (status === 402) return { message: serverMessage || 'دسترسی به ارسال کد محدود است', status, code: data?.code || '402' };
  if (status === 401) return { message: serverMessage || 'نیاز به ورود دارید', status, code: data?.code };
  if (status === 403) return { message: serverMessage || 'دسترسی غیرمجاز', status, code: data?.code };
  if (status === 404) return { message: serverMessage || 'منبع مورد نظر پیدا نشد', status, code: data?.code };
  if (status === 429) return { message: serverMessage || 'درخواست‌های زیاد؛ لطفاً بعداً تلاش کنید', status, code: data?.code };
  if (status >= 500) return { message: serverMessage || 'خطای داخلی سرور', status, code: data?.code };

  return { message: serverMessage || 'درخواست نامعتبر است', status, code: data?.code };
}

export function getErrorMessage(error: unknown): string {
  return getErrorInfo(error).message;
}

export async function httpJson<T>(path: string, init?: RequestInit & { baseUrlOverride?: string }): Promise<T> {
  const baseUrl = init?.baseUrlOverride || getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const data = await safeJson(res);
    const error: any = new Error('HTTP Error');
    error.response = { status: res.status, data };
    throw error;
  }
  return (await safeJson(res)) as T;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}


