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

// DELETE