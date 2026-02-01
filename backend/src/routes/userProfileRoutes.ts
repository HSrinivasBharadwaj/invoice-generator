import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController";
import { ValidateJWT } from "../middlewares/authMiddleware";
const userProfileRouter = express.Router();

//Get User profile
userProfileRouter.get("/profile", ValidateJWT, getUserProfile)

//Update User Profile
userProfileRouter.patch("/profile", ValidateJWT, updateUserProfile);

export default userProfileRouter