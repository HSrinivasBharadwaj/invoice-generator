import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userProfileController";
import { ValidateJWT } from "../middlewares/authMiddleware";
const userProfileRouter = express.Router();

userProfileRouter.use(ValidateJWT)

//Get User profile
userProfileRouter.get("/profile", getUserProfile)

//Update User Profile
userProfileRouter.patch("/profile", updateUserProfile);

export default userProfileRouter