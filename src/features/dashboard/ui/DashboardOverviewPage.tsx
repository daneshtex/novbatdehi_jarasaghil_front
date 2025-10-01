export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <h2 className="text-xl font-bold text-right">نمای کلی</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{ t: 'کاربران', v: '1,240' }, { t: 'سفارش‌ها', v: '312' }, { t: 'درآمد', v: '85,400,000' }].map((c) => (
          <div key={c.t} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-gray-500 text-sm">{c.t}</div>
            <div className="text-2xl font-bold mt-1">{c.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


