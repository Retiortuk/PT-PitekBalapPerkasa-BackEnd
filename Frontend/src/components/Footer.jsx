import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-2">
                <img src="https://horizons-cdn.hostinger.com/e17b5b5d-3b23-492e-8a50-f08715bdc0dd/534c3c26a2b5b5906b17544c64ebfeac.png" alt="PT. Pitek Balap Perkasa Logo" className="h-10 mr-2" />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Platform trading ayam terpercaya. Menghubungkan peternak dengan pasar secara efisien dan transparan.
            </p>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Tautan Cepat</span>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white">Beranda</a></li>
              <li><a href="/trading" className="text-gray-400 hover:text-white">Trading</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">Tentang Kami</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Kontak</a></li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Legal</span>
            <ul className="mt-2 space-y-2">
              <li><p className="text-gray-400 hover:text-white cursor-pointer">Syarat & Ketentuan</p></li>
              <li><p className="text-gray-400 hover:text-white cursor-pointer">Kebijakan Privasi</p></li>
            </ul>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Hubungi Kami</span>
            <p className="text-gray-400 mt-2">Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan, Indonesia</p>
            <p className="text-gray-400">support@pitekbalap.com</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PT. Pitek Balap Perkasa. Semua Hak Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;