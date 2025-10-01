import DataTable from '../../../shared/ui/DataTable';

type User = { id: number; name: string; mobile: string; role: string };

const rows: User[] = [
  { id: 1, name: 'علی رضایی', mobile: '09120000001', role: 'ادمین' },
  { id: 2, name: 'نگار کاظمی', mobile: '09120000002', role: 'اپراتور' },
  { id: 3, name: 'مهدی یوسفی', mobile: '09120000003', role: 'کاربر' },
];

export default function DashboardUsersPage() {
  return (
    <div className="space-y-4" dir="rtl">
      <h2 className="text-xl font-bold text-right">کاربران</h2>
      <DataTable<User>
        columns={[
          { header: 'نام', accessor: (r) => r.name },
          { header: 'موبایل', accessor: (r) => r.mobile, className: 'font-mono' },
          { header: 'نقش', accessor: (r) => r.role },
        ]}
        data={rows}
        keyField={(r) => r.id}
      />
    </div>
  );
}


