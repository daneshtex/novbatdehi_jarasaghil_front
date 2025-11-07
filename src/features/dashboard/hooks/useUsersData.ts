// src/features/dashboard/hooks/useUsersData.ts
import { useQuery } from "@tanstack/react-query";
import { httpTokenJson } from "../../../shared/api/http";

export interface UserFormData {
  name: string;
  family: string;
  nationalID: string;
  father_name: string;
  mobile: string;
  password: string;
  confirm_password: string;
}
// نوع داده‌ای که از API دریافت می‌کنید
export interface ApiUser {
  id: number;
  name: string;
  family: string | null;
  mobile: string;
  father_name: string | null;
  nationalID: string | null;
  status: boolean;
  mobile_verify_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  data: ApiUser[];
  message: string;
}

// نوع داده‌ای که کامپوننت شما نیاز دارد
export interface User {
  id: number;
  name: string;
  family: string;
  mobile: string;
  father_name: string | null;
  nationalID: string | null;
  status: "فعال" | "غیرفعال";
  mobile_verify_at: string | null;
  created_at: string;
  updated_at: string;
  roles: string;
  joinDate: string;
  lastLogin: string;
}

export function useUsersData() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await httpTokenJson<ApiResponse>("/user");

      return response.data.map((user) => ({
        id: user.id,
        name: user.name,
        family: user.family || "-",
        mobile: user.mobile,
        father_name: user.father_name,
        nationalID: user.nationalID,
        status: user.status ? "فعال" : "غیرفعال",
        mobile_verify_at: user.mobile_verify_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        roles: determineRole(user),
        joinDate: formatDate(user.created_at),
        lastLogin: formatLastLogin(user.mobile_verify_at),
      }));
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
  };
}

// تابع کمکی برای تعیین نقش کاربر
function determineRole(user: ApiUser): string {
  // اینجا منطق تعیین نقش خود را قرار دهید
  // برای مثال:
  if (user.id === 1) return "ادمین";
  if (user.mobile === "09393136098") return "اپراتور";
  return "کاربر";
}

// تابع کمکی برای فرمت تاریخ
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return "نامشخص";
  }
}

// تابع کمکی برای فرمت آخرین ورود
function formatLastLogin(verifyDate: string | null): string {
  if (!verifyDate) return "هرگز";

  try {
    const verify = new Date(verifyDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - verify.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return "همین حالا";
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)} روز پیش`;
    return `${Math.floor(diffHours / 168)} هفته پیش`;
  } catch {
    return "نامشخص";
  }
}
// ✅ اضافه کنید: نوع پاسخ برای یک کاربر (تکی)
export interface SingleUserApiResponse {
  data: ApiUser;
  message: string;
}
