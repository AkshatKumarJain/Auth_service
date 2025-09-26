import express from "express";
import { registerUser } from "../controllers/register.controller.js";
import { loginUser, logoutUser, refreshUser } from "../controllers/login.controller.js";
import { aboutUser } from "../controllers/about.controller.js";
import { authMiddleware } from "redis-jwt-auth";

const router = express.Router();

router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/logout",  logoutUser);
router.post("/refresh", refreshUser);
router.post("/about", authMiddleware({ require: true }), aboutUser);

export default router;