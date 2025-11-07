import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpTokenJson } from "../../../../shared/api/http";
import type { CarFormData, ApiResponse } from "../../hooks/useCarsData";
import toast from "react-hot-toast";
// 👈 import از فایل types

// 👇 اضافه کردن اینترفیس برای خطاهای API
interface ApiErrorResponse {
  message: string;
  errors: {
    name?: string[];
  };
}

export default function AddCarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CarFormData>({
    name: "", // 👈 خالی شد
  });

  const [errors, setErrors] = useState<Partial<CarFormData>>({});

  const createCarMutation = useMutation({
    mutationFn: async (carData: CarFormData) => {
      const response = await httpTokenJson<ApiResponse>("/car", {
        method: "POST",
        body: JSON.stringify(carData),
      });
      console.log("🔍 [Mutation Response]:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("✅ ناوگان با موفقیت ایجاد شد:", data);

      // بررسی کن که واقعاً کاربر ایجاد شده
      if (!data) {
        toast.error("پاسخ از سرور دریافت نشد", {
          duration: 5000,
          position: "top-left",
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("ناوگان با موفقیت ایجاد شد!");
      navigate("/dashboard/cars");
    },
    onError: (error: any) => {
      console.error("❌ خطا در ایجاد ناوگان:", error);
      console.log("🔍 [Error Details]:", error.response?.data);

      if (error.response?.data) {
        const apiErrorData = error.response.data as ApiErrorResponse;

        // اگر پیام خطا وجود دارد نمایش بده
        if (apiErrorData.message) {
          toast.error(`خطا: ${apiErrorData.message}`);
        }

        // تبدیل خطاهای API به فرمت فرم
        const newApiErrors: Partial<CarFormData> = {};
        if (apiErrorData.errors?.name) {
          newApiErrors.name = apiErrorData.errors.name[0];
        }

        setErrors(newApiErrors);
      } else {
        toast.error("خطای ناشناخته‌ای رخ داده است. لطفا دوباره تلاش کنید.");
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CarFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createCarMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6 w-full overflow-hidden" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            افزودن کاربر جدید
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            اطلاعات کاربر جدید را وارد کنید
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/cars")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          بازگشت
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* نام */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="نام را وارد کنید"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* وضعیت  */}
            {/* <div className="space-y-2">
              <label
                htmlFor="father_name"
                className="block text-sm font-medium text-gray-700"
              >
                 وضعیت <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="father_name"
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="وضعیت"
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div> */}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200">
            {/* انصراف */}
            <button
              type="button"
              onClick={() => navigate("/dashboard/cars")}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={createCarMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {createCarMutation.isPending ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  در حال ایجاد...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  ایجاد ناوگان
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
