import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CheckSquare,
  Home,
  Bell,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoops: 0,
    totalStock: 0,
    totalTransactions: 0,
    pendingApprovals: 0,
    pendingVerifications: 0,
  });

  useEffect(() => {
    const fetchDashboardAdmin = async() => {
      if(!token) {
        setLoading(false)
        return;
      }

      try { // Tambahkan sisah res nya di dalam array
        const [userRes, coopsRes, stoksRes] = await Promise.all([
          // Get users total
          fetch('http://localhost:5000/users', {
            headers : {'Authorization': `Bearer ${token}`}
          }),
          fetch('http://localhost:5000/kandang', {
            headers : {'Authorization': `Bearer ${token}`}
          }),
          fetch('http://localhost:5000/stok', {
            headers : {'Authorization': `Bearer ${token}`}
          })
          // Get Stok Total
          //dll.....
        ]);

        if(!userRes.ok) throw new Error("Gagal Mendapatkan Total User"); 
        if(!coopsRes.ok) throw new Error("Gagal Mendapatkan Total Kandang");
        if(!stoksRes.ok) throw new Error("Gagal Mendapatkan Total Kandang");
        // Total Stok Error dll......

        const usersData = await userRes.json();
        const coopsData = await coopsRes.json();
        const stokData = await stoksRes.json();
        const totalEkorAyam = stokData.reduce((total, item) => total + item.stokAwal, 0)
        // const stokData = await dataStok.json(); dll dan seterusnya....

        // const pendingVerifications = usersData.filter(u => u.verificationStatus === 'pending').length;
        setStats({
          totalUsers: usersData.length,
          totalCoops: coopsData.length,
          totalStock: totalEkorAyam,
          totalTransactions: 0,
          pendingApprovals: 0,
          pendingVerifications: 0
        });
      } catch (error) {
        toast({title: "Error", description: error.message, variant: "destructive"})
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAdmin();
  }, [token]);

  const StatCard = ({ icon, title, value, description, path, notification, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col shadow-lg border-l-4 ${color}`}>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <Link to={path} className="mt-4">
            <Button variant="outline" className="w-full">
              Kelola
              {notification > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  {notification}
                </span>
              )}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Dasbor Admin - PT. Pitek Balap Perkasa</title>
        <meta name="description" content="Dasbor admin untuk mengelola platform trading ayam." />
      </Helmet>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dasbor Admin</h1>
              <p className="text-gray-500">Selamat datang kembali, {user.namaLengkap}!</p>
            </div>
            <div className="relative">
              <Bell className="text-gray-600 h-6 w-6" />
              {(stats.pendingApprovals + stats.pendingVerifications) > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                  {stats.pendingApprovals + stats.pendingVerifications}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<Package className="h-5 w-5 text-gray-500" />} title="Total Stok Ayam" value={`${stats.totalStock} Ekor`} description="Jumlah semua stok di kandang" path="/admin/stock" color="border-blue-500" />
            <StatCard icon={<ShoppingCart className="h-5 w-5 text-gray-500" />} title="Total Transaksi" value={`${stats.totalTransactions} Transaksi`} description="Semua transaksi yang tercatat" path="/admin/transactions" color="border-green-500" />
            <StatCard icon={<Users className="h-5 w-5 text-gray-500" />} title="Total Pengguna" value={`${stats.totalUsers} Pengguna`} description="Jumlah pengguna terdaftar" path="/admin/users" color="border-purple-500" />
            <StatCard icon={<CheckSquare className="h-5 w-5 text-gray-500" />} title="Persetujuan SPPA" value={`${stats.pendingApprovals} Butuh Aksi`} description="Transaksi menunggu persetujuan" path="/admin/approvals" notification={stats.pendingApprovals} color="border-red-500" />
            <StatCard icon={<ShieldCheck className="h-5 w-5 text-gray-500" />} title="Verifikasi Pengguna" value={`${stats.pendingVerifications} Butuh Aksi`} description="Pengguna menunggu verifikasi" path="/admin/verification" notification={stats.pendingVerifications} color="border-yellow-500" />
            <StatCard icon={<Home className="h-5 w-5 text-gray-500" />} title="Total Kandang" value={`${stats.totalCoops} Kandang`} description="Jumlah kandang mitra" path="/admin/coops" color="border-indigo-500" />
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;