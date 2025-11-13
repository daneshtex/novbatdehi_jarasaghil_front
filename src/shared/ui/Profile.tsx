import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // ✅ اضافه شود
import { APP_NAME } from "../config/app";

interface ProfileProps {
  className?: string;
  showEditButton?: boolean;
  onEdit?: () => void;
}

export default function Profile({
  className = "",
  showEditButton = true,
}: ProfileProps) {
  const { user, loading } = useAuth(); // ✅ گرفتن داده کاربر و وضعیت بارگذاری
  const [isEditing, setIsEditing] = useState(false);

  // در صورتی که کاربر لود شده باشد، مقدار اولیه را از user بگیر
  const [name, setName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.mobile || "");

  // در صورتی که هنوز در حال لود است
  if (loading) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-gray-500 animate-pulse">
          در حال بارگذاری اطلاعات...
        </p>
      </div>
    );
  }

  // در صورتی که هنوز user مقدار ندارد
  if (!user) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <p className="text-red-500 font-semibold">اطلاعات کاربر یافت نشد.</p>
      </div>
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    console.log(`${APP_NAME}: Profile saved:`, { name, mobile });
    // ⚠️ اینجا می‌تونی درخواست PATCH به /auth/me بزنی
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name);
    setMobile(user.mobile);
  };

  const displayName = isEditing ? name : user.name;
  const displayMobile = isEditing ? mobile : user.mobile;

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-blue-600 px-8 py-12 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
              <span className="text-3xl font-bold text-white">
                {displayName.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-2">{displayName}</h1>
              <div className="flex items-center gap-2 text-white/90">
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
                    d="M3 5a2 2 0 012-2h3.28..."
                  />
                </svg>
                <span className="font-medium">{displayMobile}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {showEditButton && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
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
                  d="M11 5H6..."
                />
              </svg>
              ویرایش پروفایل
            </button>
          )}
        </div>
      </div>

      {/* بقیه JSX مثل قبل (ویرایش/نمایش) */}
    </div>
  );
}
