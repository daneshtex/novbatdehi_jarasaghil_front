import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpTokenJson } from "../../../../shared/api/http";
import type { UserFormData, ApiResponse } from "../../hooks/useUsersData";
import toast from "react-hot-toast";
// 👈 import از فایل types

// 👇 اضافه کردن اینترفیس برای خطاهای API
interface ApiErrorResponse {
  message: string;
  errors: {
    nationalID?: string[];
    mobile?: string[];
    name?: string[];
    family?: string[];
    father_name?: string[];
    password?: string[];
    confirm_password?: string[];
  };
}

export default function AddUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UserFormData>({
    name: "", // 👈 خالی شد
    family: "", // 👈 خالی شد
    nationalID: "", // 👈 خالی شد
    father_name: "", // 👈 خالی شد
    mobile: "", // 👈 خالی شد
    password: "", // 👈 خالی شد
    confirm_password: "", // 👈 خالی شد
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await httpTokenJson<ApiResponse>("/user", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      console.log("🔍 [Mutation Response]:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("✅ کاربر با موفقیت ایجاد شد:", data);

      // بررسی کن که واقعاً کاربر ایجاد شده
      if (!data) {
        toast.error("پاسخ از سرور دریافت نشد", {
          duration: 5000,
          position: "top-left",
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("کاربر با موفقیت ایجاد شد!");
      navigate("/dashboard/users");
    },
    onError: (error: any) => {
      console.error("❌ خطا در ایجاد کاربر:", error);
      console.log("🔍 [Error Details]:", error.response?.data);

      if (error.response?.data) {
        const apiErrorData = error.response.data as ApiErrorResponse;

        // اگر پیام خطا وجود دارد نمایش بده
        if (apiErrorData.message) {
          toast.error(`خطا: ${apiErrorData.message}`);
        }

        // تبدیل خطاهای API به فرمت فرم
        const newApiErrors: Partial<UserFormData> = {};

        if (apiErrorData.errors?.nationalID) {
          newApiErrors.nationalID = apiErrorData.errors.nationalID[0];
        }
        if (apiErrorData.errors?.mobile) {
          newApiErrors.mobile = apiErrorData.errors.mobile[0];
        }
        if (apiErrorData.errors?.name) {
          newApiErrors.name = apiErrorData.errors.name[0];
        }
        if (apiErrorData.errors?.family) {
          newApiErrors.family = apiErrorData.errors.family[0];
        }
        if (apiErrorData.errors?.father_name) {
          newApiErrors.father_name = apiErrorData.errors.father_name[0];
        }
        if (apiErrorData.errors?.password) {
          newApiErrors.password = apiErrorData.errors.password[0];
        }
        if (apiErrorData.errors?.confirm_password) {
          newApiErrors.confirm_password =
            apiErrorData.errors.confirm_password[0];
        }

        setErrors(newApiErrors);
      } else {
        toast.error("خطای ناشناخته‌ای رخ داده است. لطفا دوباره تلاش کنید.");
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<UserFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام الزامی است";
    }

    if (!formData.family.trim()) {
      newErrors.family = "نام خانوادگی الزامی است";
    }

    if (!formData.nationalID.trim()) {
      newErrors.nationalID = "کد ملی الزامی است";
    } else if (!/^\d{10}$/.test(formData.nationalID)) {
      newErrors.nationalID = "کد ملی باید ۱۰ رقم باشد";
    }

    if (!formData.father_name.trim()) {
      newErrors.father_name = "نام پدر الزامی است";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد";
    }

    if (!formData.password.trim()) {
      newErrors.password = "رمز عبور الزامی است";
    } else if (formData.password.length < 4) {
      newErrors.password = "رمز عبور باید حداقل 4 کاراکتر باشد";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "رمز عبور و تکرار آن باید یکسان باشند";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createUserMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
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
          onClick={() => navigate("/dashboard/users")}
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

            {/* نام خانوادگی */}
            <div className="space-y-2">
              <label
                htmlFor="family"
                className="block text-sm font-medium text-gray-700"
              >
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="family"
                value={formData.family}
                onChange={(e) => handleInputChange("family", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.family ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="نام خانوادگی را وارد کنید"
              />
              {errors.family && (
                <p className="text-red-500 text-sm">{errors.family}</p>
              )}
            </div>

            {/* کد ملی */}
            <div className="space-y-2">
              <label
                htmlFor="nationalID"
                className="block text-sm font-medium text-gray-700"
              >
                کد ملی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nationalID"
                value={formData.nationalID}
                onChange={(e) =>
                  handleInputChange("nationalID", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.nationalID ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="کد ملی را وارد کنید"
                maxLength={10}
                dir="ltr"
              />
              {errors.nationalID && (
                <p className="text-red-500 text-sm">{errors.nationalID}</p>
              )}
            </div>

            {/* نام پدر */}
            <div className="space-y-2">
              <label
                htmlFor="father_name"
                className="block text-sm font-medium text-gray-700"
              >
                نام پدر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="father_name"
                value={formData.father_name}
                onChange={(e) =>
                  handleInputChange("father_name", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.father_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="نام پدر را وارد کنید"
              />
              {errors.father_name && (
                <p className="text-red-500 text-sm">{errors.father_name}</p>
              )}
            </div>

            {/* شماره موبایل */}
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                شماره موبایل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.mobile ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="شماره موبایل را وارد کنید"
                maxLength={11}
                dir="ltr"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
            </div>

            {/* رمز عبور */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                رمز عبور <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="رمز عبور را وارد کنید"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* تکرار رمز عبور */}
            <div className="space-y-2">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700"
              >
                تکرار رمز عبور <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={(e) =>
                  handleInputChange("confirm_password", e.target.value)
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.confirm_password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="رمز عبور را مجدداً وارد کنید"
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200">
            {/* انصراف */}
            <button
              type="button"
              onClick={() => navigate("/dashboard/users")}
              className="px-4 sm:px-6 py-2 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {createUserMutation.isPending ? (
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
                  ایجاد کاربر
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
