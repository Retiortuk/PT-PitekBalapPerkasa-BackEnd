import mongoose from "mongoose";
import Kandang from "../models/Kandang.js";
// GET
export const getKandangs = async (req, res) => {
    try {
        const kandangs = await Kandang.find();
        res.json(kandangs);

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};

// POST
export const createKandang = async (req, res) => {
    try {
        const kandang = new Kandang(req.body);
        const kandangSaved = await kandang.save();
        res.status(201).json(kandangSaved);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

// PATCH
export const updateKandang = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid ID Format"});
        }

        const updatedKandang = await Kandang.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if (!updatedKandang) {
            return res.status(400).json({message: "Kandang Not Found"});
        }
        res.json(updatedKandang);
    } catch (err) {
        return res.status(400).json({message: err.message});
    }
};

// DELETE
export const deleteKandang = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid ID Format"});
        }

        const deletedKandang = await Kandang.findByIdAndDelete(req.params.id);

        if (!deletedKandang) {
            return res.status(400).json({message: "Kandang Not Found"});
        }
        res.json({message: "Kandang Deleted Successfully"});

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};