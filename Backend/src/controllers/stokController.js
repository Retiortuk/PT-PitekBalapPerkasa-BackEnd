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

// PATCH
export const updateStok = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid ID Format"});
        }
        const updatedStok = await Stok.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )

        if (!updatedStok) {
            return res.status(400).json({message: "Stok Not Found"});
        }
        res.json(updatedStok);
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
};

// DELETE
export const deleteStok = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid ID Format"});
        }

        const deletedStok = await Stok.findByIdAndDelete(req.params.id);

        if(!deletedStok) {
            return res.status(400).json({message: "Stok Not Found"});
        }
        res.json({message: "Stok Deleted Successfully"});

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};