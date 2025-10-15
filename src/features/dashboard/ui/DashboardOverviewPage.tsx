import Profile from '../../../shared/ui/Profile';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">نمای کلی</h1>
          <p className="text-gray-600 mt-2">خوش آمدید! اینجا می‌توانید وضعیت کلی سیستم را مشاهده کنید</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">آنلاین</span>
        </div>
      </div>

      {/* Profile Section */}
      <Profile />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: 'کل کاربران', 
            value: '1,240', 
            change: '+12%', 
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-6a4 4 0 11-8 0 4 4 0 018 0m10 4a4 4 0 11-8 0 4 4 0 018 0" />
              </svg>
            ),
            color: 'blue'
          },
          { 
            title: 'سفارشات فعال', 
            value: '312', 
            change: '+8%', 
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            ),
            color: 'orange'
          },
          { 
            title: 'درآمد ماهانه', 
            value: '85,400,000', 
            change: '+15%', 
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            ),
            color: 'green'
          },
          { 
            title: 'نرخ تبدیل', 
            value: '68%', 
            change: '+3%', 
            changeType: 'positive',
            icon: (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            color: 'blue'
          }
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
            <div key={stat.title} className={`${colors.container} rounded-2xl p-6 border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className={`${colors.text} text-sm font-medium mb-1`}>{stat.title}</p>
                <p className={`${colors.textDark} text-2xl font-bold`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">فعالیت‌های اخیر</h3>
          <button className="text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors duration-200">
            مشاهده همه
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'کاربر جدید ثبت شد', user: 'احمد محمدی', time: '۵ دقیقه پیش', type: 'user' },
            { action: 'سفارش جدید دریافت شد', user: 'مریم احمدی', time: '۱۵ دقیقه پیش', type: 'order' },
            { action: 'پرداخت تأیید شد', user: 'علی رضایی', time: '۳۰ دقیقه پیش', type: 'payment' },
            { action: 'محصول جدید اضافه شد', user: 'مدیر سیستم', time: '۱ ساعت پیش', type: 'product' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'user' ? 'bg-blue-100' :
                activity.type === 'order' ? 'bg-green-100' :
                activity.type === 'payment' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <svg className={`w-5 h-5 ${
                  activity.type === 'user' ? 'text-blue-600' :
                  activity.type === 'order' ? 'text-green-600' :
                  activity.type === 'payment' ? 'text-purple-600' :
                  'text-orange-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.user}</p>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


