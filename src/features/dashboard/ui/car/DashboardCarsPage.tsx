import DataTable, { type Column } from "../../../../shared/ui/DataTable";
import { useCarsData, type Car } from "../../hooks/useCarsData";
import { useNavigate } from "react-router-dom";

const createColumns = (navigate: (path: string) => void): Column<Car>[] => [
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
    render: (_, record) => (
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/dashboard/cars/${record.id}`);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1"
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
      </div>
    ),
    sortable: false,
    align: "center",
  },
];

export default function DashboardCarsPage() {
  const { cars } = useCarsData();
  const navigate = useNavigate();

  const handleRowClick = (car: Car) => {
    console.log("Car clicked:", car);
    // Navigate to car details page
    navigate(`/dashboard/cars/${car.id}`);
  };

  const handleSelectionChange = (selectedCars: Car[]) => {
    console.log("Selected cars:", selectedCars);
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
            onClick={() => navigate("/dashboard/cars/add")}
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
            value: cars.length,
            color: "blue",
            icon: "👥",
          },
          {
            title: "کاربران فعال",
            value: cars.filter((u) => u.status === "فعال").length,
            color: "green",
            icon: "✅",
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
        data={cars}
        columns={columns}
        searchable={true}
        searchPlaceholder="جستجو درناوگان..."
        pagination={true}
        pageSize={5}
        selectable={true}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        emptyMessage="هیچ ناوگان یافت نشد"
      />
    </div>
  );
}
