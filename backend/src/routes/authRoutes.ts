import express from "express";
import { Login, Logout, Signup } from "../controllers/authController";
import { loginLimiter } from "../middlewares/rateLimiter";
const authRouter = express.Router();

//Register User
authRouter.post("/signup", Signup);
// Apply brute‑force protection to login endpoint
authRouter.post("/login", loginLimiter, Login);
authRouter.post("/logout", Logout);

export default authRouter;