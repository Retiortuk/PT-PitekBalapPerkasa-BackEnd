import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Banknote, QrCode, CheckCircle, Loader2, Copy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PrePaymentPage = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentProof, setPaymentProof] = useState(null);

    useEffect(() => {
        const tempOrder = JSON.parse(localStorage.getItem('temp_order'));
        if (tempOrder) {
            setOrder(tempOrder);
        } else {
            navigate('/cart');
        }
    }, [navigate]);
    
    const handleProofUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPaymentProof({
                    name: file.name,
                    dataUrl: event.target.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const confirmPayment = () => {
        if (!paymentProof) {
            toast({ title: "Bukti Pembayaran Diperlukan", description: "Harap unggah bukti pembayaran Anda.", variant: "destructive" });
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const updatedOrder = { ...order, status: 'payment_review', paymentProof: paymentProof };
            
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            allOrders.push(updatedOrder);
            localStorage.setItem('orders', JSON.stringify(allOrders));
            
            localStorage.removeItem('temp_order');
            
            // Clear cart
            const { user } = JSON.parse(localStorage.getItem('user'));
            if(user) localStorage.removeItem(`cart_${user.id}`);


            setLoading(false);
            toast({ title: "Konfirmasi Terkirim!", description: "Admin akan segera meninjau pembayaran Anda." });
            navigate('/dashboard');
        }, 1500);
    };

    if (!order) return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;

    return (
        <>
            <Helmet><title>Pembayaran di Muka - {order.id}</title></Helmet>
            <Navbar />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <Link to="/checkout" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Checkout
                </Link>
                <h1 className="text-3xl font-bold mb-6">Pembayaran di Muka</h1>

                <Card className="mb-6 shadow-lg">
                    <CardHeader><CardTitle>Detail Tagihan</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                            <span>Total Estimasi:</span>
                            <span>Rp {(order.estimatedTotal || 0).toLocaleString('id-ID')}</span>
                        </div>
                         <p className="text-xs text-gray-500 pt-2">Total ini adalah estimasi. Selisih akan disesuaikan setelah penimbangan.</p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Instruksi Pembayaran</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <p>Silakan lakukan pembayaran ke salah satu rekening berikut:</p>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                                <p className="font-semibold">Bank BCA</p>
                                <p>No. Rekening: <span className="font-mono">1234567890</span></p>
                                <p>Atas Nama: PT Pitek Balap Perkasa</p>
                            </div>
                            <img className="w-48 mx-auto" alt="Contoh kode QRIS untuk pembayaran" src="https://api.qr-code-generator.com/v1/create?access-token=your-token&qr_code_text=https://example.com&image_format=PNG&image_width=500" />
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader><CardTitle>Konfirmasi Pembayaran</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <p>Unggah bukti pembayaran Anda untuk kami verifikasi.</p>
                            <div>
                                <Label htmlFor="payment-proof">Unggah Bukti</Label>
                                <Input id="payment-proof" type="file" onChange={handleProofUpload} accept="image/*" />
                            </div>
                            {paymentProof && (
                                <div className="text-center">
                                    <img src={paymentProof.dataUrl} alt="Preview bukti" className="max-h-48 mx-auto rounded-lg" />
                                    <p className="text-xs text-gray-500 mt-1">{paymentProof.name}</p>
                                </div>
                            )}
                            <Button onClick={confirmPayment} className="w-full btn-gradient" disabled={loading || !paymentProof}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Konfirmasi Pembayaran'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    );
};

export default PrePaymentPage;