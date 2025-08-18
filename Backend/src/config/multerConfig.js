import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Lokasi File Penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/ktp';
        fs.mkdirSync(uploadPath, {recursive: true});
        connectDB(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

// Hanya Menerima Gambar
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Hanya File Berformat JPEG, PNG, JPG yang diizinkan!'), false)
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 
    }
});

export default upload;