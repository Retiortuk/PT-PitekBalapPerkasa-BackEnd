import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Printer, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const InvoicePage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const foundOrder = allOrders.find(o => o.id === orderId);
        setOrder(foundOrder);
    }, [orderId]);

    if (!order) {
        return (
            <>
                <Navbar />
                <div className="text-center py-20"><h1 className="text-2xl font-bold">Invoice tidak ditemukan</h1></div>
            </>
        );
    }

    const subtotal = order.actualTotal;
    const tax = subtotal * 0.11;
    const total = subtotal + tax;

    return (
        <>
            <Helmet><title>Invoice #{order.id}</title></Helmet>
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="flex justify-between items-center mb-6 noprint">
                        <Link to="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Link>
                        <Button onClick={() => window.print()} variant="outline">
                            <Printer className="h-4 w-4 mr-2" />
                            Cetak Invoice
                        </Button>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="shadow-lg">
                            <CardHeader className="bg-gray-50 p-6 border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
                                        <p className="text-gray-500">No: INV-{order.id.substring(5)}</p>
                                    </div>
                                    <div className="text-right flex items-center">
                                       <img src="https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/534c3c26a2b5b5906b17544c64ebfeac.png" alt="Logo" className="h-12" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Ditagihkan Kepada:</h4>
                                        <p className="font-bold">{order.customerName}</p>
                                    </div>
                                    <div className="text-right">
                                        <h4 className="font-semibold text-gray-700 mb-2">Tanggal Invoice:</h4>
                                        <p>{new Date().toLocaleDateString('id-ID')}</p>
                                        <h4 className="font-semibold text-gray-700 mt-2 mb-2">Batas Waktu:</h4>
                                        <p>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>

                                <h4 className="font-semibold text-gray-700 mb-3">Detail Penimbangan</h4>
                                <div className="overflow-x-auto mb-8">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left font-semibold p-2">Deskripsi</th>
                                                <th className="text-right font-semibold p-2">Tonase Aktual (Kg)</th>
                                                <th className="text-right font-semibold p-2">Harga/Kg</th>
                                                <th className="text-right font-semibold p-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-2">Pembelian Ayam Broiler Sesuai SPPA #{order.id}</td>
                                                <td className="text-right p-2">{order.weighingData.actualTonnage}</td>
                                                <td className="text-right p-2">Rp {Number(order.weighingData.actualPrice).toLocaleString('id-ID')}</td>
                                                <td className="text-right p-2">Rp {Number(order.actualTotal).toLocaleString('id-ID')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end">
                                    <div className="w-full max-w-sm">
                                        <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rp {subtotal.toLocaleString('id-ID')}</span></div>
                                        <div className="flex justify-between mb-2"><span>PPN (11%)</span><span>Rp {tax.toLocaleString('id-ID')}</span></div>
                                        <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total Tagihan</span><span>Rp {total.toLocaleString('id-ID')}</span></div>
                                    </div>
                                </div>
                                
                                <div className="mt-12 text-xs text-gray-500">
                                    <h4 className="font-semibold mb-2">Catatan:</h4>
                                    <p>Mohon lakukan pembayaran sebelum tanggal jatuh tempo. Terima kasih atas kerja sama Anda.</p>
                                </div>

                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default InvoicePage;