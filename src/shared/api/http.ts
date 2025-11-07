import { getEnv } from "../config/env";

export type ApiErrorInfo = { message: string; status?: number; code?: string };

type HttpErrorLike = {
  response?: { status: number; data?: any };
  code?: string;
  message?: string;
};

export function getBaseUrl(): string {
  return getEnv().apiBaseUrl;
}

export function getErrorInfo(error: unknown): ApiErrorInfo {
  const err = error as HttpErrorLike;

  if (!err.response) {
    if ((err as any)?.code === "ECONNABORTED") {
      return { message: "پاسخ‌گویی سرور بیش از حد طول کشید", code: "TIMEOUT" };
    }
    return {
      message: "اتصال شما به اینترنت برقرار نیست",
      code: (err as any)?.code,
    };
  }

  const status = err.response.status;
  const data = err.response.data as any;
  const serverMessage =
    (typeof data === "string" ? data : undefined) ||
    data?.message ||
    data?.error ||
    data?.detail;

  if (status === 402)
    return {
      message: serverMessage || "دسترسی به ارسال کد محدود است",
      status,
      code: data?.code || "402",
    };
  if (status === 401)
    return {
      message: serverMessage || "نیاز به ورود دارید",
      status,
      code: data?.code,
    };
  if (status === 403)
    return {
      message: serverMessage || "دسترسی غیرمجاز",
      status,
      code: data?.code,
    };
  if (status === 404)
    return {
      message: serverMessage || "منبع مورد نظر پیدا نشد",
      status,
      code: data?.code,
    };
  if (status === 429)
    return {
      message: serverMessage || "درخواست‌های زیاد؛ لطفاً بعداً تلاش کنید",
      status,
      code: data?.code,
    };
  if (status >= 500)
    return {
      message: serverMessage || "خطای داخلی سرور",
      status,
      code: data?.code,
    };

  return {
    message: serverMessage || "درخواست نامعتبر است",
    status,
    code: data?.code,
  };
}

export function getErrorMessage(error: unknown): string {
  return getErrorInfo(error).message;
}
async function safeJson(res: Response) {
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function httpJson<T>(
  path: string,
  init?: RequestInit & { baseUrlOverride?: string }
): Promise<T> {
  const baseUrl = init?.baseUrlOverride || getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("🚀 [API Request] Full URL:", url); // 👈 این خط را اضافه کنید
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const data = await safeJson(res);
    const error: any = new Error("HTTP Error");
    error.response = { status: res.status, data };
    throw error;
  }
  return (await safeJson(res)) as T;
}

// در فایل http.ts

export async function httpTokenJson<T>(
  path: string,
  init?: RequestInit & { baseUrlOverride?: string }
): Promise<T> {
  // const baseUrl = init?.baseUrlOverride || getBaseUrl();
  const baseUrl = "http://192.168.43.100:8000/api";
  // const baseUrl =
  //   init?.baseUrlOverride || (import.meta.env.DEV ? "" : getBaseUrl());
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("🚀 [API Request] Full URL:", url);

  // دریافت token از localStorage یا session
  const token =
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };

  // اضافه کردن token اگر وجود دارد
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("🔍 [API Headers]:", headers);

  const res = await fetch(url, {
    headers,
    ...init,
  });

  console.log("🔍 [API Response] Status:", res.status, res.statusText);

  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.text();
      console.error("🔍 [API Error] Response text:", errorData);

      try {
        errorData = JSON.parse(errorData);
      } catch {
        // اگر JSON نبود، همان text باقی می‌ماند
      }
    } catch {
      errorData = "Cannot read error response";
    }

    const error: any = new Error(`HTTP Error: ${res.status} ${res.statusText}`);
    error.response = { status: res.status, data: errorData };
    console.error("🔍 [API Error Details]:", error);
    throw error;
  }
  async function safeJson(res: Response) {
    try {
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  const data = await safeJson(res);
  console.log("✅ [API Success] Data:", data);
  return data as T;
}

// http.ts
