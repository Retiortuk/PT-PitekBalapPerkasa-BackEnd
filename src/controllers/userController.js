import mongoose from "mongoose";
import User from "../models/User.js";

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
        const user =  new User(req.body);
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