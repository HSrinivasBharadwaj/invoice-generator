import express from "express";
import { Login, Logout, Signup } from "../controllers/authController";
const authRouter = express.Router();

//Register User
authRouter.post("/signup", Signup);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout)

export default authRouter;