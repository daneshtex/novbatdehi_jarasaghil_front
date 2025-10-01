import DataTable from '../../../shared/ui/DataTable';

type Order = { id: number; ref: string; customer: string; total: number; status: 'جدید' | 'ارسال‌شده' | 'تحویل' };

const rows: Order[] = [
  { id: 11, ref: 'ORD-2024-0011', customer: 'پارسا طاهری', total: 1200000, status: 'جدید' },
  { id: 12, ref: 'ORD-2024-0012', customer: 'سمانه شعبانی', total: 840000, status: 'ارسال‌شده' },
  { id: 13, ref: 'ORD-2024-0013', customer: 'نوید ایران‌پور', total: 2150000, status: 'تحویل' },
];

export default function DashboardOrdersPage() {
  return (
    <div className="space-y-4" dir="rtl">
      <h2 className="text-xl font-bold text-right">سفارش‌ها</h2>
      <DataTable<Order>
        columns={[
          { header: 'کد پیگیری', accessor: (r) => r.ref, className: 'font-mono text-right' },
          { header: 'مشتری', accessor: (r) => r.customer, className: 'text-right' },
          { header: 'مبلغ (تومان)', accessor: (r) => r.total.toLocaleString(), className: 'text-right' },
          { header: 'وضعیت', accessor: (r) => r.status, className: 'text-right' },
        ]}
        data={rows}
        keyField={(r) => r.id}
      />
    </div>
  );
}


