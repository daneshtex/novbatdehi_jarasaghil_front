// src/features/dashboard/hooks/useCarsData.ts
import { useQuery } from "@tanstack/react-query";
import { httpTokenJson } from "../../../shared/api/http";

export interface CarFormData {
  name: string;
}
// نوع داده‌ای که از API دریافت می‌کنید
export interface ApiCar {
  id: number;
  name: string;
}

export interface ApiResponse {
  data: ApiCar[];
  message: string;
}

// نوع داده‌ای که کامپوننت شما نیاز دارد
export interface Car {
  id: number;
  name: string;
}

export function useCarsData() {
  const carsQuery = useQuery({
    queryKey: ["cars"],
    queryFn: async (): Promise<Car[]> => {
      const response = await httpTokenJson<ApiResponse>("/car");

      return response.data.map((car) => ({
        id: car.id,
        name: car.name,
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
export interface SingleCarApiResponse {
  data: ApiCar;
  message: string;
}
