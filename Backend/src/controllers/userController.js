import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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