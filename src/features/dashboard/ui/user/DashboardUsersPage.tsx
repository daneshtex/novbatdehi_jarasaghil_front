import React, { useState } from "react";
import DataTable, { type Column } from "../../../../shared/ui/DataTable";
import { useUsersData, type User } from "../../hooks/useUsersData";
import { useNavigate } from "react-router-dom";
import { httpTokenJson } from "../../../../shared/api/http";
import toast from "react-hot-toast";

export default function DashboardUsersPage() {
  const { users, refetch } = useUsersData();
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState<User | null>(null);
  const [modalType, setModalType] = useState<"delete" | "status" | null>(null);

  // حذف ماشین
  async function handleDeleteCar() {
    if (!selectedData) return;
    try {
      await httpTokenJson(`/user/${selectedData.id}`, { method: "DELETE" });
      toast.success(`ماشین "${selectedData.name}" با موفقیت حذف شد.`);
      closeModal();
      refetch?.();
    } catch (err) {
      console.error(err);
      toast.error("حذف ماشین با خطا مواجه شد.");
    }
  }

  // تغییر وضعیت فعال/غیرفعال
  async function handleToggleStatus() {
    if (!selectedData) return;
    try {
      await httpTokenJson(`/user/toggle/${selectedData.id}`, {
        method: "GET",
      });
      const newStatus = selectedData.status === "فعال" ? "غیرفعال" : "فعال";
      toast.success(`ماشین "${selectedData.name}" اکنون ${newStatus} است.`);
      closeModal();
      refetch?.();
    } catch (err) {
      console.error(err);
      toast.error("تغییر وضعیت با خطا مواجه شد.");
    }
  }
  const closeModal = () => {
    setModalType(null);
    setSelectedData(null);
  };
  const createColumns = (navigate: (path: string) => void): Column<User>[] => [
    {
      key: "id",
      title: "شناسه ",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{record.id}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: "name",
      title: "نام ",
      render: (_, record) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {record.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
              {record.name}
            </p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "family",
      title: "فامیل",
      render: (_, record) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
              {record.family}
            </p>
          </div>
        </div>
      ),
      sortable: true,
    },

    {
      key: "mobile",
      title: "شماره موبایل",
      render: (value) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span
            className="font-mono text-gray-700 text-xs sm:text-sm"
            dir="ltr"
          >
            {value}
          </span>
        </div>
      ),
      sortable: true,
      align: "right",
    },

    {
      key: "nationalID",
      title: "کد ملی ",
      render: (_, record) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="font-medium text-gray-900 text-xs sm:text-sm">
            {record.nationalID}
          </p>
        </div>
      ),
      sortable: true,
    },
    {
      key: "roles",
      title: "نقش",
      render: (value) => (
        <span
          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
            value === "ادمین"
              ? "bg-red-100 text-red-700"
              : value === "اپراتور"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {value}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      title: "وضعیت",
      render: (value) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              value === "فعال" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span
            className={`text-xs sm:text-sm font-medium ${
              value === "فعال" ? "text-green-700" : "text-gray-500"
            }`}
          >
            {value}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "actions",
      title: "عملیات",
      align: "center",
      render: (_, record) => {
        const isActive = record.status === "فعال";
        return (
          <div className="flex justify-center gap-2">
            {/* مشاهده */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/users/${record.id}`);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex
              items-center gap-1"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="hidden sm:inline">مشاهده</span>
            </button>
            {/* تغییر وضعیت */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedData(record);
                setModalType("status");
              }}
              className={`text-white px-3 py-1 rounded-lg text-xs font-medium ${
                isActive
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isActive ? "غیرفعال " : "فعال "}
            </button>
            {/* حذف */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedData(record);
                setModalType("delete");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
            >
              حذف
            </button>
          </div>
        );
      },
    },
  ];

  const handleRowClick = (user: User) => {
    console.log("User clicked:", user);
    // Navigate to user details page
    navigate(`/dashboard/users/${user.id}`);
  };

  const handleSelectionChange = (selectedUsers: User[]) => {
    console.log("Selected users:", selectedUsers);
    // Here you would typically handle bulk actions
  };

  const columns = createColumns(navigate);

  return (
    <div className="space-y-6 w-full overflow-hidden" dir="rtl">
      {/* Page Header */}
      <div className="lg:flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            مدیریت کاربران
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            لیست تمام کاربران سیستم و مدیریت دسترسی‌ها
          </p>
        </div>
        <div className="flex items-center gap-3 pt-4 sm:pt-6 lg:pt-0">
          <button
            onClick={() => navigate("/dashboard/users/add")}
            className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="hidden sm:inline">افزودن کاربر</span>
            <span className="sm:hidden">افزودن</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "کل کاربران",
            value: users.length,
            color: "blue",
            icon: "👥",
          },
          {
            title: "کاربران فعال",
            value: users.filter((u) => u.status === "فعال").length,
            color: "green",
            icon: "✅",
          },
          {
            title: "ادمین‌ها",
            value: users.filter((u) => u.roles === "ادمین").length,
            color: "orange",
            icon: "👑",
          },
          {
            title: "اپراتورها",
            value: users.filter((u) => u.roles === "اپراتور").length,
            color: "blue",
            icon: "⚙️",
          },
        ].map((stat) => {
          const getColorClasses = (color: string) => {
            switch (color) {
              case "blue":
                return {
                  container:
                    "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
                  text: "text-blue-600",
                  textDark: "text-blue-900",
                  iconBg: "bg-blue-500",
                };
              case "green":
                return {
                  container:
                    "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
                  text: "text-green-600",
                  textDark: "text-green-900",
                  iconBg: "bg-green-500",
                };
              case "red":
                return {
                  container:
                    "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
                  text: "text-red-600",
                  textDark: "text-red-900",
                  iconBg: "bg-red-500",
                };
              case "orange":
                return {
                  container:
                    "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
                  text: "text-orange-600",
                  textDark: "text-orange-900",
                  iconBg: "bg-orange-500",
                };
              default:
                return {
                  container:
                    "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
                  text: "text-gray-600",
                  textDark: "text-gray-900",
                  iconBg: "bg-gray-500",
                };
            }
          };

          const colors = getColorClasses(stat.color);

          return (
            <div
              key={stat.title}
              className={`${colors.container} rounded-xl p-4 border`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${colors.text} text-sm font-medium`}>
                    {stat.title}
                  </p>
                  <p className={`${colors.textDark} text-2xl font-bold`}>
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center text-white text-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        searchable={true}
        searchPlaceholder="جستجو در کاربران..."
        pagination={true}
        pageSize={5}
        selectable={true}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        emptyMessage="هیچ کاربری یافت نشد"
      />
      {/* Modal سفارشی */}
      {modalType && selectedData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-right">
              {modalType === "delete"
                ? `آیا از حذف "${selectedData.name}" مطمئن هستید؟`
                : selectedData.status === "فعال"
                ? `آیا از غیرفعال کردن "${selectedData.name}" مطمئن هستید؟`
                : `آیا از فعال کردن "${selectedData.name}" مطمئن هستید؟`}
            </h2>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                onClick={closeModal}
              >
                انصراف
              </button>
              {modalType === "delete" ? (
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleDeleteCar}
                >
                  تایید حذف
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={handleToggleStatus}
                >
                  تایید
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
