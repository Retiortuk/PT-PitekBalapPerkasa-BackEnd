import express from "express";
import { getUsers, createUser, updateUser, deleteUser, loginUser } from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// PATH
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", protect, isAdmin, getUsers);
router.patch("/:id", protect, isAdmin, updateUser);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router;