import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    // Var kosong buat token
    let token

    // Pengecekan Auth
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (err) {
            return res.status(401).json({message: "Token Tidak Valid"});
        }
    }
    if (!token) {
        return res.status(401).json({message: "Tidak Ada Token"})
    }
};

const isAdmin = async (req, res, next) => {
    if(req.user && req.user.jenisAkun === 'Admin') {
        next();
    } else {
        return res.status(400).json({message: "Akses Ditolak!, Hanya Admin"});
    }
};

export {protect, isAdmin};