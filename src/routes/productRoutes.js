import express from "express";
import { getProducts, createProducts, deleteProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProducts);
router.delete("/:id", deleteProduct);

export default router;