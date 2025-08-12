import mongoose from "mongoose";
import Product from "../models/Product.js";

//GET
export const getProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);

    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

// POST
export const createProducts = async(req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

// DELETE
export const deleteProduct = async(req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({message: "Invalid ID Format"});
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({message: "Product Not Found"});
        }

        res.json({message: "Product Deleted Succesfully"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};