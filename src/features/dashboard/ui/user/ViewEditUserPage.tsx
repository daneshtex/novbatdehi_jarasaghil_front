import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpTokenJson } from "../../../../shared/api/http";
import toast from "react-hot-toast";
// 👇 تمامی انواع را از هوک import می‌کنیم
import type {
  UserFormData,
  ApiUser,
  SingleUserApiResponse,
} from "../../hooks/useUsersData";

// 👇 اضافه کنید بعد از سایر interfaceها
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

interface ApiResponse {
  data: ApiUser;
  message: string;
}

export default function ViewEditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    family: "",
    nationalID: "",
    father_name: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  // Fetch user data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async (): Promise<ApiUser> => {
      const response = await httpTokenJson<SingleUserApiResponse>(
        `/user/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Omit<UserFormData, "confirm_password">) => {
      const response = await httpTokenJson<ApiResponse>(`/user/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      setIsEditing(false);
      toast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد!");
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
      if (error.response?.data) {
        const apiErrorData = error.response.data as ApiErrorResponse;

        // نمایش پیام کلی
        if (apiErrorData.message) {
          toast.error(`خطا: ${apiErrorData.message}`);
        }

        // تبدیل خطاهای فیلدی
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
        toast.error("خطای ناشناخته‌ای رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    },
  });

  // Initialize form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        family: user.family || "",
        nationalID: user.nationalID || "",
        father_name: user.father_name || "",
        mobile: user.mobile || "",
        password: "",
        confirm_password: "",
      });
    }
  }, [user]);

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

    if (isEditing && formData.password && formData.password.length < 4) {
      newErrors.password = "رمز عبور باید حداقل 4 کاراکتر باشد";
    }

    if (isEditing && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "رمز عبور و تکرار آن باید یکسان باشند";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirm_password, password, ...rest } = formData;

      let userData;
      if (password) {
        // اگر رمز جدید وارد شده، هر دو فیلد را بفرست
        userData = { ...rest, password, confirm_password };
      } else {
        // اگر رمز جدیدی وارد نشده، هیچ‌کدام را نفرست
        userData = rest;
      }
      // Only include password if it's provided
      // if (!userData.password) {
      //   delete userData.password;
      // }

      updateUserMutation.mutate(userData);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        family: user.family || "",
        nationalID: user.nationalID || "",
        father_name: user.father_name || "",
        mobile: user.mobile || "",
        password: "",
        confirm_password: "",
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-blue-600 animate-spin"
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
          </div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">
          خطا در بارگذاری اطلاعات کاربر
        </div>
        <button
          onClick={() => navigate("/dashboard/users")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
        >
          بازگشت به لیست کاربران
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full overflow-hidden" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isEditing ? "ویرایش کاربر" : "مشاهده کاربر"}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {isEditing ? "اطلاعات کاربر را ویرایش کنید" : "اطلاعات کامل کاربر"}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="hidden sm:inline">ویرایش</span>
              <span className="sm:hidden">ویرایش</span>
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/users")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base flex-1 sm:flex-none"
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
            <span className="hidden sm:inline">بازگشت</span>
            <span className="sm:hidden">بازگشت</span>
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
              {user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {user.name} {user.family}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {user.roles && user.roles.length > 0
                  ? user.roles.join(", ")
                  : "کاربر"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.status ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    user.status ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {user.status ? "فعال" : "غیرفعال"}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.family ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nationalID ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.father_name ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
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
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="شماره موبایل را وارد کنید"
                  maxLength={11}
                  dir="ltr"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div>

              {/*  تاریخ تولد */}
              {/* <div className="space-y-2">
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                   تاریخ تولد <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  } ${!isEditing ? "bg-gray-50" : ""}`}
                  placeholder="تاریخ تولد را وارد کنید "
               
                  dir="ltr"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile}</p>
                )}
              </div> */}

              {/* رمز عبور (فقط در حالت ویرایش) */}
              {isEditing && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      رمز عبور جدید (اختیاری)
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500
                         focus:border-transparent transition-all duration-200 ${
                           errors.password
                             ? "border-red-500"
                             : "border-gray-300"
                         }`}
                      placeholder="رمز عبور جدید را وارد کنید"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      تکرار رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      value={formData.confirm_password}
                      onChange={(e) =>
                        handleInputChange("confirm_password", e.target.value)
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors.confirm_password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="رمز عبور جدید را مجدداً وارد کنید"
                    />
                    {errors.confirm_password && (
                      <p className="text-red-500 text-sm">
                        {errors.confirm_password}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Additional Info (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  تاریخ عضویت
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {user.created_at
                    ? new Intl.DateTimeFormat("fa-IR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }).format(new Date(user.created_at))
                    : "نامشخص"}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateUserMutation.isPending ? (
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
                      در حال ذخیره...
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      ذخیره تغییرات
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
