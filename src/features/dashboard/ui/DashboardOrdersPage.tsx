import DataTable, { type Column } from '../../../shared/ui/DataTable';

type Order = { 
  id: number; 
  ref: string; 
  customer: string; 
  mobile: string;
  total: number; 
  status: 'جدید' | 'ارسال‌شده' | 'تحویل' | 'لغو شده';
  date: string;
  items: number;
};

const orders: Order[] = [
  { id: 11, ref: 'ORD-2024-0011', customer: 'پارسا طاهری', mobile: '09120000001', total: 1200000, status: 'جدید', date: '۱۴۰۲/۰۶/۱۵', items: 3 },
  { id: 12, ref: 'ORD-2024-0012', customer: 'سمانه شعبانی', mobile: '09120000002', total: 840000, status: 'ارسال‌شده', date: '۱۴۰۲/۰۶/۱۴', items: 2 },
  { id: 13, ref: 'ORD-2024-0013', customer: 'نوید ایران‌پور', mobile: '09120000003', total: 2150000, status: 'تحویل', date: '۱۴۰۲/۰۶/۱۳', items: 5 },
  { id: 14, ref: 'ORD-2024-0014', customer: 'فاطمه احمدی', mobile: '09120000004', total: 650000, status: 'جدید', date: '۱۴۰۲/۰۶/۱۲', items: 1 },
  { id: 15, ref: 'ORD-2024-0015', customer: 'حسن محمدی', mobile: '09120000005', total: 1800000, status: 'ارسال‌شده', date: '۱۴۰۲/۰۶/۱۱', items: 4 },
  { id: 16, ref: 'ORD-2024-0016', customer: 'زهرا کریمی', mobile: '09120000006', total: 950000, status: 'تحویل', date: '۱۴۰۲/۰۶/۱۰', items: 2 },
  { id: 17, ref: 'ORD-2024-0017', customer: 'علی رضایی', mobile: '09120000007', total: 3200000, status: 'جدید', date: '۱۴۰۲/۰۶/۰۹', items: 6 },
];

const columns: Column<Order>[] = [
  {
    key: 'ref',
    title: 'کد پیگیری',
    render: (value) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
          #
        </div>
        <span className="font-mono text-gray-700 font-medium" dir="ltr">{value}</span>
      </div>
    ),
    sortable: true,
    align: 'right',
  },
  {
    key: 'customer',
    title: 'مشتری',
    render: (value, record) => (
      <div>
        <p className="font-medium text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 font-mono" dir="ltr">{record.mobile}</p>
      </div>
    ),
    sortable: true,
  },
  {
    key: 'total',
    title: 'مبلغ کل',
    render: (value) => (
      <div className="text-right">
        <p className="font-bold text-gray-900">{value.toLocaleString()} تومان</p>
        <p className="text-xs text-gray-500">قابل پرداخت</p>
      </div>
    ),
    sortable: true,
    align: 'right',
  },
  {
    key: 'status',
    title: 'وضعیت',
    render: (value) => (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        value === 'جدید' ? 'bg-blue-100 text-blue-700' :
        value === 'ارسال‌شده' ? 'bg-yellow-100 text-yellow-700' :
        value === 'تحویل' ? 'bg-green-100 text-green-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value}
      </span>
    ),
    sortable: true,
  },
  {
    key: 'items',
    title: 'تعداد آیتم',
    render: (value) => (
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="font-medium text-gray-700">{value} آیتم</span>
      </div>
    ),
    sortable: true,
    align: 'center',
  },
  {
    key: 'date',
    title: 'تاریخ سفارش',
    sortable: true,
    align: 'center',
  },
];

export default function DashboardOrdersPage() {
  const handleRowClick = (order: Order) => {
    console.log('Order clicked:', order);
    // Here you would typically navigate to order details or open a modal
  };

  const handleSelectionChange = (selectedOrders: Order[]) => {
    console.log('Selected orders:', selectedOrders);
    // Here you would typically handle bulk actions
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'تحویل')
      .reduce((sum, order) => sum + order.total, 0);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مدیریت سفارشات</h1>
          <p className="text-gray-600 mt-2">پیگیری و مدیریت تمام سفارشات سیستم</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            گزارش سفارشات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            title: 'کل سفارشات', 
            value: orders.length, 
            color: 'blue', 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )
          },
          { 
            title: 'سفارشات جدید', 
            value: orders.filter(o => o.status === 'جدید').length, 
            color: 'orange', 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            title: 'در انتظار ارسال', 
            value: orders.filter(o => o.status === 'ارسال‌شده').length, 
            color: 'blue', 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            )
          },
          { 
            title: 'درآمد کل', 
            value: getTotalRevenue().toLocaleString(), 
            color: 'green', 
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            )
          },
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
              case 'orange':
                return {
                  container: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
                  text: 'text-orange-600',
                  textDark: 'text-orange-900',
                  iconBg: 'bg-orange-500'
                };
              case 'green':
                return {
                  container: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
                  text: 'text-green-600',
                  textDark: 'text-green-900',
                  iconBg: 'bg-green-500'
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
                <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={orders}
        columns={columns}
        searchable={true}
        searchPlaceholder="جستجو در سفارشات..."
        pagination={true}
        pageSize={5}
        selectable={true}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        emptyMessage="هیچ سفارشی یافت نشد"
      />
    </div>
  );
}


