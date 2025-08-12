import express from "express";
import { getKandangs, createKandang, updateKandang } from "../controllers/kandangController.js";

const router = express.Router();

router.get("/", getKandangs);
router.post("/", createKandang);
router.patch("/:id", updateKandang);

export default router;