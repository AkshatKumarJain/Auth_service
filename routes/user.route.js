import express from "express";
import { registerUser } from "../controllers/register.controller.js";
import { loginUser, logoutUser, refreshUser } from "../controllers/login.controller.js";
import { aboutUser } from "../controllers/about.controller.js";
import { authMiddleware } from "redis-jwt-auth";
import { sendVerifyOtp, verifyEmail } from "../controllers/verifyEmail.controller.js";

const router = express.Router();

router.post("/create", registerUser);
router.post("/login", loginUser);
router.post("/logout",  logoutUser);
router.post("/refresh", refreshUser);
router.post("/about", authMiddleware({ require: true }), aboutUser);
router.post("/send-otp", authMiddleware({ required: true }), sendVerifyOtp);
router.post("/verify-account", authMiddleware({ required: true }), verifyEmail);

export default router;