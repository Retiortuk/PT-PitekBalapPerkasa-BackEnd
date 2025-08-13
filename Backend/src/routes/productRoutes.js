import express from "express";
import { getProducts, createProducts, deleteProduct, updateProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProducts);
router.delete("/:id", deleteProduct);
router.patch("/:id", updateProduct)

export default router;