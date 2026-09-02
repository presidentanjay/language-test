import { useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface Payment {
  id: number;
  userId: string;
  orderId: string;
  examCode: string;
  amount: number;
  statusPay: string;
  paymentType: string;
  createdAt: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.data) {
        setPayments(data.data); // Based on Adonis pagination
      } else if (Array.isArray(data)) {
        setPayments(data);
      }
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments.filter(p => p.statusPay === 'settlement').reduce((acc, p) => acc + p.amount, 0);
  const totalSettled = payments.filter(p => p.statusPay === 'settlement').length;
  const totalPending = payments.filter(p => p.statusPay === 'pending').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
              <p className="text-2xl font-black text-slate-900">Rp {totalRevenue.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transaksi</p>
              <p className="text-2xl font-black text-slate-900">{payments.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement</p>
              <p className="text-2xl font-black text-slate-900">{totalSettled}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-black text-slate-900">{totalPending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Ujian</th>
                  <th className="px-6 py-4">Jumlah</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{p.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.examCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap">Rp {p.amount.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.statusPay === 'settlement' || p.statusPay === 'capture'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.statusPay === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {p.statusPay}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.paymentType || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
