import Product from "../models/Product.js";

export const getProducts = async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);

    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const createProducts = async(req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (err) {
        res.status(400).json({message: err.message});
    }
};