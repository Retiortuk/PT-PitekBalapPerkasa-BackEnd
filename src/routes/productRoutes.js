import express from "express";
import { getProducts, createProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", createProducts);


export default router;