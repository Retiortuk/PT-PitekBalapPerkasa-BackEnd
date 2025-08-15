import express from "express";
import { getKandangs, createKandang, updateKandang, deleteKandang } from "../controllers/kandangController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getKandangs);
router.post("/", protect, isAdmin, createKandang);
router.patch("/:id", protect, isAdmin, updateKandang);
router.delete("/:id", protect, isAdmin, deleteKandang);

export default router;