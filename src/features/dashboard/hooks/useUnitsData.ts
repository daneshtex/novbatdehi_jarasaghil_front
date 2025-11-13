// src/features/dashboard/hooks/useCarsData.ts
import { useQuery } from "@tanstack/react-query";
import { httpTokenIndexJson } from "../../../shared/api/http";

export interface CarFormData {
  name: string;
}
// نوع داده‌ای که از API دریافت می‌کنید
export interface Api {
  id: number;
  name: string;
  status: boolean; // ✅ boolean
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  data: Api[];
  message: string;
}

// نوع داده‌ای که کامپوننت شما نیاز دارد
export interface Car {
  id: number;
  name: string;
  status: "فعال" | "غیرفعال";
}

export function useModelData() {
  const carsQuery = useQuery({
    queryKey: ["units"],
    queryFn: async (): Promise<Car[]> => {
      const response = await httpTokenIndexJson<ApiResponse>("/unit");

      return response.data.map((res) => ({
        id: res.id,
        name: res.name,
        status: res.status ? "فعال" : "غیرفعال", // ✅ تبدیل
      }));
    },
  });

  return {
    cars: carsQuery.data || [],
    isLoading: carsQuery.isLoading,
    isError: carsQuery.isError,
    error: carsQuery.error,
    refetch: carsQuery.refetch,
  };
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

// ✅ اضافه کنید: نوع پاسخ برای یک کاربر (تکی)
export interface SingleCarApiResponse {
  data: Api;
  message: string;
}
