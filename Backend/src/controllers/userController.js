import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { response } from "express";


// -------------- FUNGSI LOGIN/REGISTER/UPDATE/DELETE ---------
// Login
export const loginUser = async(req, res) => {
    const { email, password} = req.body;

    try {
        // Cek User Terdaftarkah?
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({message: "User Tidak Ditemukan"});

        // Cek Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({message: "Password Salah"});

        const token = jwt.sign(
            {id: user._id, email: user.email, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        return res.status(200).json({
            message: "Login Berhasil", 
            token,
            user: {
                id: user._id,
                namaLengkap: user.namaLengkap,
                email: user.email,
                jenisAkun: user.jenisAkun
            }
            
        });

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// GET
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// POST
export const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user =  new User({
            ...req.body,
            password: hashedPassword
        });
        const userSaved = await user.save();
        res.status(201).json(userSaved);

    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

// PATCH
export const updateUser = async (req, res) => {
    try {   
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({message: "Invalid ID Format"});
            }

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new: true}
            );

            if (!updatedUser) {
                return res.status(400).json({message: "User Not Found"});
            }
            res.json(updatedUser);

    } catch (err) {
        return res.status(400).json({message: err.message});
    }
};

// DELETE
export const deleteUser = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "invalid ID Format"});
        }

        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if(!deletedUser) {
            return res.status(400).json({message: "User Not Found"});
        }

        res.json({message: "User Deleted Successfully"});

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// -------------------- FUNGSI VERIFIKASI USER --------------------------
// PATCH
export const uploadKtp = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({message: "File KTP Tidak Ditemukan!"});
        }
        const ktpImageUrl = `/uploads/ktp/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                ktpImageUrl: ktpImageUrl,
                verificationStatus: 'pending'
            },
            {new: true}
        ).select('-password');

        if(!user) {
            return res.status(404).json({message: "User Tidak Ditemukan"});
        }

        res.json({
            message: "Upload KTP Berhasil! Menunggu Verifikasi Dari Admin"
        });
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// GET
export const getPendingVerifications = async(req, res) => {
    try{
        const pendingUsers =  await User.find({verificationStatus: 'pending'}).select('-password');
        res.json(pendingUsers);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// PATCH
export const approveVerifications =  async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { verificationStatus: 'approve'},
            {new: true}
        ).select('-password');

        if(!user) {
            return res.status(404).json({message: "User Tidak Ditemukan!"});
        }
        res.json({message: `Verifikasi Untuk ${user.namaLengkap} Berhasil Disetujui`});
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// PATCH
export const rejectVerification = async(req, res) => {
    try {
        const {rejectionReason} = req.body;
        if(!rejectionReason) {
            return res.status(400).json({message: "Penolakan Harus Diisi Dengan Alasan"})
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                verificationStatus: 'rejected',
                rejectionReason: rejectionReason
            },
        ).select('-password');

        if(!user) {
            return res.status(404).json({message: "User Tidak Ditemukan"})
        }
        res.json({message: `Verifikasi Untuk ${user.namaLengkap} Berhasil Ditolak`})
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};