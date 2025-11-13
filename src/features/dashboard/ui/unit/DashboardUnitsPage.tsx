import React, { useState } from "react";
import DataTable, { type Column } from "../../../../shared/ui/DataTable";
import { useModelData, type Car } from "../../hooks/useUnitsData";
import { useNavigate } from "react-router-dom";
import { httpTokenJson } from "../../../../shared/api/http";
import toast from "react-hot-toast";

export default function DashboardCarsPage() {
  const { cars, refetch } = useModelData();
  const navigate = useNavigate();

  const [selectedData, setSelectedData] = useState<Car | null>(null);
  const [modalType, setModalType] = useState<"delete" | "status" | null>(null);

  // حذف ماشین
  async function handleDeleteCar() {
    if (!selectedData) return;
    try {
      await httpTokenJson(`/unit/${selectedData.id}`, { method: "DELETE" });
      toast.success(`انواع کانتینر "${selectedData.name}" با موفقیت حذف شد.`);
      closeModal();
      refetch?.();
    } catch (err) {
      console.error(err);
      toast.error("حذف انواع کانتینر با خطا مواجه شد.");
    }
  }

  // تغییر وضعیت فعال/غیرفعال
  async function handleToggleStatus() {
    if (!selectedData) return;
    try {
      await httpTokenJson(`/car/toggle/${selectedData.id}`, {
        method: "GET",
      });
      const newStatus = selectedData.status === "فعال" ? "غیرفعال" : "فعال";
      toast.success(` واحد "${selectedData.name}" اکنون ${newStatus} است.`);
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

  const createColumns = (navigate: (path: string) => void): Column<Car>[] => [
    {
      key: "id",
      title: "شناسه",
      render: (_, record) => (
        <p className="text-sm text-gray-600 text-center">{record.id}</p>
      ),
      sortable: true,
    },
    {
      key: "name",
      title: "نام",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            {record.name.charAt(0)}
          </div>
          <span className="font-medium">{record.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: "status",
      title: "وضعیت",
      render: (value) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              value === "فعال" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          <span
            className={`text-sm font-medium ${
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/cars/${record.id}`);
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
              {isActive ? "غیرفعال کردن" : "فعال کردن"}
            </button>

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

  const columns = createColumns(navigate);

  return (
    <div className="space-y-6 w-full overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت ناوگان</h1>
        <button
          onClick={() => navigate("/dashboard/cars/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          افزودن ناوگان
        </button>
      </div>

      {/* جدول */}
      <DataTable
        data={cars}
        columns={columns}
        searchable
        searchPlaceholder="جستجو در واحد..."
        pagination
        pageSize={5}
        emptyMessage="هیچ واحد یافت نشد"
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
