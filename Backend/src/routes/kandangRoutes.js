import express from "express";
import { getKandangs, createKandang, updateKandang, deleteKandang } from "../controllers/kandangController.js";

const router = express.Router();

router.get("/", getKandangs);
router.post("/", createKandang);
router.patch("/:id", updateKandang);
router.delete("/:id", deleteKandang);

export default router;