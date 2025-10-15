import DataTable, { type Column } from '../../../shared/ui/DataTable';

type User = { 
  id: number; 
  name: string; 
  mobile: string; 
  role: string; 
  status: 'فعال' | 'غیرفعال';
  joinDate: string;
  lastLogin: string;
};

const users: User[] = [
  { id: 1, name: 'علی رضایی', mobile: '09120000001', role: 'ادمین', status: 'فعال', joinDate: '۱۴۰۲/۰۱/۱۵', lastLogin: 'امروز' },
  { id: 2, name: 'نگار کاظمی', mobile: '09120000002', role: 'اپراتور', status: 'فعال', joinDate: '۱۴۰۲/۰۲/۲۰', lastLogin: 'دیروز' },
  { id: 3, name: 'مهدی یوسفی', mobile: '09120000003', role: 'کاربر', status: 'غیرفعال', joinDate: '۱۴۰۲/۰۳/۱۰', lastLogin: '۱ هفته پیش' },
  { id: 4, name: 'فاطمه احمدی', mobile: '09120000004', role: 'کاربر', status: 'فعال', joinDate: '۱۴۰۲/۰۴/۰۵', lastLogin: '۲ ساعت پیش' },
  { id: 5, name: 'حسن محمدی', mobile: '09120000005', role: 'اپراتور', status: 'فعال', joinDate: '۱۴۰۲/۰۵/۱۲', lastLogin: 'امروز' },
  { id: 6, name: 'زهرا کریمی', mobile: '09120000006', role: 'کاربر', status: 'فعال', joinDate: '۱۴۰۲/۰۶/۱۸', lastLogin: '۳ ساعت پیش' },
];

const columns: Column<User>[] = [
  {
    key: 'name',
    title: 'نام و نام خانوادگی',
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {record.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{record.name}</p>
          <p className="text-sm text-gray-500">ID: {record.id}</p>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'mobile',
    title: 'شماره موبایل',
    render: (value) => (
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="font-mono text-gray-700" dir="ltr">{value}</span>
      </div>
    ),
    sortable: true,
    align: 'right',
  },
  {
    key: 'role',
    title: 'نقش',
    render: (value) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        value === 'ادمین' ? 'bg-red-100 text-red-700' :
        value === 'اپراتور' ? 'bg-blue-100 text-blue-700' :
        'bg-green-100 text-green-700'
      }`}>
        {value}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'status',
    title: 'وضعیت',
    render: (value) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          value === 'فعال' ? 'bg-green-500' : 'bg-gray-400'
        }`}></div>
        <span className={`text-sm font-medium ${
          value === 'فعال' ? 'text-green-700' : 'text-gray-500'
        }`}>
          {value}
        </span>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'joinDate',
    title: 'تاریخ عضویت',
    sortable: true,
    align: 'center',
  },
  {
    key: 'lastLogin',
    title: 'آخرین ورود',
    sortable: true,
    align: 'center',
  },
];

export default function DashboardUsersPage() {
  const handleRowClick = (user: User) => {
    console.log('User clicked:', user);
    // Here you would typically navigate to user details or open a modal
  };

  const handleSelectionChange = (selectedUsers: User[]) => {
    console.log('Selected users:', selectedUsers);
    // Here you would typically handle bulk actions
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
          <p className="text-gray-600 mt-2">لیست تمام کاربران سیستم و مدیریت دسترسی‌ها</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            افزودن کاربر
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'کل کاربران', value: users.length, color: 'blue', icon: '👥' },
          { title: 'کاربران فعال', value: users.filter(u => u.status === 'فعال').length, color: 'green', icon: '✅' },
          { title: 'ادمین‌ها', value: users.filter(u => u.role === 'ادمین').length, color: 'orange', icon: '👑' },
          { title: 'اپراتورها', value: users.filter(u => u.role === 'اپراتور').length, color: 'blue', icon: '⚙️' },
        ].map((stat) => {
          const getColorClasses = (color: string) => {
            switch (color) {
              case 'blue':
                return {
                  container: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
                  text: 'text-blue-600',
                  textDark: 'text-blue-900',
                  iconBg: 'bg-blue-500'
                };
              case 'green':
                return {
                  container: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
                  text: 'text-green-600',
                  textDark: 'text-green-900',
                  iconBg: 'bg-green-500'
                };
              case 'red':
                return {
                  container: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
                  text: 'text-red-600',
                  textDark: 'text-red-900',
                  iconBg: 'bg-red-500'
                };
              case 'orange':
                return {
                  container: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
                  text: 'text-orange-600',
                  textDark: 'text-orange-900',
                  iconBg: 'bg-orange-500'
                };
              default:
                return {
                  container: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200',
                  text: 'text-gray-600',
                  textDark: 'text-gray-900',
                  iconBg: 'bg-gray-500'
                };
            }
          };
          
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={stat.title} className={`${colors.container} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${colors.text} text-sm font-medium`}>{stat.title}</p>
                  <p className={`${colors.textDark} text-2xl font-bold`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center text-white text-lg`}>
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
    </div>
  );
}


