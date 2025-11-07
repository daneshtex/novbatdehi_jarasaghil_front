import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpTokenJson } from "../../../../shared/api/http";
import toast from "react-hot-toast";
// 👇 تمامی انواع را از هوک import می‌کنیم
import type {
  CarFormData,
  ApiCar,
  SingleCarApiResponse,
} from "../../hooks/useCarsData";

// 👇 اضافه کنید بعد از سایر interfaceها
interface ApiErrorResponse {
  message: string;
  errors: {
    name?: string[];
  };
}

interface ApiResponse {
  data: ApiCar;
  message: string;
}

export default function ViewEditCarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    name: "",
  });

  const [errors, setErrors] = useState<Partial<CarFormData>>({});

  // Fetch car data
  const {
    data: car,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["car", id],
    queryFn: async (): Promise<ApiCar> => {
      const response = await httpTokenJson<SingleCarApiResponse>(`/car/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  // Update car mutation
  const updateCarMutation = useMutation({
    mutationFn: async (carData: Omit<CarFormData, "confirm_password">) => {
      const response = await httpTokenJson<ApiResponse>(`/car/${id}`, {
        method: "PUT",
        body: JSON.stringify(carData),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["car", id] });
      setIsEditing(false);
      toast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد!");
    },
    onError: (error: any) => {
      console.error("Error updating car:", error);
      if (error.response?.data) {
        const apiErrorData = error.response.data as ApiErrorResponse;

        // نمایش پیام کلی
        if (apiErrorData.message) {
          toast.error(`خطا: ${apiErrorData.message}`);
        }

        // تبدیل خطاهای فیلدی
        const newApiErrors: Partial<CarFormData> = {};

        if (apiErrorData.errors?.name) {
          newApiErrors.name = apiErrorData.errors.name[0];
        }

        setErrors(newApiErrors);
      } else {
        toast.error("خطای ناشناخته‌ای رخ داده است. لطفاً دوباره تلاش کنید.");
      }
    },
  });

  // Initialize form data when car data is loaded
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || "",
      });
    }
  }, [car]);

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
  };

  const handleInputChange = (field: keyof CarFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    if (car) {
      setFormData({
        name: car.name || "",
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

  if (isError || !car) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">
          خطا در بارگذاری اطلاعات کاربر
        </div>
        <button
          onClick={() => navigate("/dashboard/cars")}
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
            onClick={() => navigate("/dashboard/cars")}
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

      {/* car Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
              {car.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              {/* <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    car.status ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    car.status ? "text-green-700" : "text-gray-500"
                  }`}
                >
                  {car.status ? "فعال" : "غیرفعال"}
                </span>
              </div> */}
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
                  disabled={updateCarMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateCarMutation.isPending ? (
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
