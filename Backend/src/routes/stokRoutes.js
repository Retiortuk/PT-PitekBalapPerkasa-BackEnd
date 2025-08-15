import express from "express";
import { getStoks, createStok, updateStok, deleteStok } from "../controllers/stokController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getStoks);
router.post("/",protect, isAdmin, createStok);
router.patch("/:id", protect, isAdmin, updateStok);
router.delete("/:id", protect, isAdmin, deleteStok);

export default router;