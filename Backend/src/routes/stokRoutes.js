import express from "express";
import { getStoks, createStok, updateStok, deleteStok } from "../controllers/stokController.js";

const router = express.Router();

router.get("/", getStoks);
router.post("/", createStok);
router.patch("/:id", updateStok);
router.delete("/:id", deleteStok);

export default router;