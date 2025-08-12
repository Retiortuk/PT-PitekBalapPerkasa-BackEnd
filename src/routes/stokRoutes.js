import express from "express";
import { getStoks, createStok } from "../controllers/stokController.js";

const router = express.Router();

router.get("/", getStoks);
router.post("/", createStok);

export default router;