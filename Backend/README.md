## Backend Yang Harus Ditambahkan 

- Database + API {
    Isi Collection:
    - Pengguna/User {
        (Seperti Daftar Akun)
        Document: 
        - Jenis akun (Pembeli/Peternak)
        - Nama Lengkap
        - Email
        - Password
        - Nomor Telepon
        - Alamat
        - Nama Bank
        - Nomor Rek
        - Nama Pemilik Rekening
    }


    - Kandang {
        Document:
        - Nama Kandang
        - Alamat
        - Kapasitas (Ekor)
        - Kontak {
            - Nama
            - No Hp
        }
    }

    - Stok {
        Document:
        - Nama Kandang
        - Deskripsi
        - Alamat Lengkap
        - Ukuran(contoh: 0.8-1.0)
        - Stok Awal(contoh 1 ekor)
        - Metode Jual (dropdown per kg/per Ekor)
        - Harga Satuan
        - Kondisi (dropdown: sehat, sakit, penjarangan)
    }
};

- Riwayat Transaksi
- Verifikasi Pengguna

- Sistem Login dan Daftar {
    implementasikan akun login dan daftar di web nya 
}

- Kontak {
    Support Kontak jadi user bisa kontak ke owner atau admin nya
};


## ADMIN DEMO
Email: admin@pitekbalap.com 
PW: admin123   