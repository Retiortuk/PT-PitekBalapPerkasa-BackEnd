import mongoose from "mongoose";
import Stok from "../models/stok.js";

// GET
export const getStoks = async (req, res) => {
    try {
        const stoks = await Stok.find();
        res.json(stoks);

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// POST
export const createStok = async (req, res) => {
    try {
        const stok = new Stok(req.body);
        const stokSaved = await stok.save();
        res.status(201).json(stokSaved);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};