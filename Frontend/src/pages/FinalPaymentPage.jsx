import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Banknote, QrCode, CheckCircle, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';

const FinalPaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [loading, setLoading] = useState(false);

    const banks = [
        { name: 'Bank BCA', va: '1234567890123', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia_logo.svg/2560px-Bank_Central_Asia_logo.svg.png' },
        { name: 'Bank Mandiri', va: '0987654321098', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png' },
        { name: 'Bank BNI', va: '1122334455667', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png' },
        { name: 'Bank BRI', va: '5544332211009', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BRI_2020.svg/1200px-BRI_2020.svg.png' },
    ];

    useEffect(() => {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = allOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            navigate('/dashboard');
        }
    }, [orderId, navigate]);
    
    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedOrders = allOrders.map(o => 
                o.id === orderId ? { ...o, status: 'completed' } : o
            );
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            setLoading(false);
            toast({
                title: "Pembayaran Berhasil!",
                description: "Pesanan Anda telah lunas. Terima kasih!"
            });
            navigate('/dashboard');
        }, 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Disalin!", description: "Nomor Virtual Account telah disalin." });
    };

    if (!order) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <>
            <Helmet><title>Pembayaran Final - {order.id}</title></Helmet>
            <Navbar />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <Link to={`/receipt/${orderId}`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Detail Pesanan
                </Link>
                <h1 className="text-3xl font-bold mb-6">Pembayaran Final #{order.id}</h1>

                <Card className="mb-6 shadow-lg">
                    <CardHeader><CardTitle>Detail Tagihan</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Tonase Aktual:</span><span className="font-medium">{order.weighingData?.actualTonnage || 0} kg</span></div>
                            <div className="flex justify-between"><span>Harga Aktual/kg:</span><span className="font-medium">Rp {(order.weighingData?.actualPrice || 0).toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total Tagihan:</span><span>Rp {(order.actualTotal || 0).toLocaleString('id-ID')}</span></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Pilih Metode Pembayaran</CardTitle>
                        <CardDescription>Pilih metode yang paling nyaman untuk Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-20 text-lg"><QrCode className="mr-2 h-6 w-6" /> Bayar dengan QRIS</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                  <DialogTitle>Pembayaran QRIS</DialogTitle>
                                </DialogHeader>
                                <div className="bg-white p-4 rounded-lg">
                                    <div className="text-center mb-2">
                                        <p className="font-bold">QRIS PT. PITEK BALAP PERKASA</p>
                                    </div>
                                    <img  className="w-full h-auto rounded-md" alt="Contoh kode QRIS untuk pembayaran" src="https://api.qr-code-generator.com/v1/create?access-token=your-token&qr_code_text=https://example.com&image_format=PNG&image_width=500" />
                                    <div className="text-center mt-4">
                                        <p className="font-bold text-2xl">Rp {(order.actualTotal || 0).toLocaleString('id-ID')}</p>
                                    </div>
                                    <Button onClick={handlePayment} className="w-full mt-4 btn-gradient" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Saya Sudah Bayar'}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                         <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-20 text-lg"><Banknote className="mr-2 h-6 w-6" /> Virtual Account</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><CardTitle>Pilih Bank Virtual Account</CardTitle></DialogHeader>
                                <div className="space-y-2 mt-4">
                                {banks.map(bank => (
                                    <Button key={bank.name} variant="outline" className="w-full justify-start h-14" onClick={() => setSelectedBank(bank)}>
                                        <img src={bank.logo} alt={`${bank.name} logo`} className="h-6 mr-4"/>
                                        {bank.name}
                                    </Button>
                                ))}
                                </div>
                                {selectedBank && (
                                    <motion.div initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} className="mt-4 p-4 bg-gray-100 rounded-md">
                                        <h3 className="font-bold">{selectedBank.name} Virtual Account</h3>
                                        <div className="flex items-center justify-between my-2 bg-white p-2 rounded">
                                            <p className="text-lg font-mono">{selectedBank.va}</p>
                                            <Button size="icon" variant="ghost" onClick={() => copyToClipboard(selectedBank.va)}><Copy className="h-4 w-4"/></Button>
                                        </div>
                                        <p>Total: <span className="font-bold">Rp {(order.actualTotal || 0).toLocaleString('id-ID')}</span></p>
                                        <Button onClick={handlePayment} className="w-full mt-4 btn-gradient" disabled={loading}>
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Saya Sudah Bayar'}
                                        </Button>
                                    </motion.div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

            </main>
        </>
    );
};

export default FinalPaymentPage;