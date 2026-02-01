import express from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/userProfileController";
import { ValidateJWT } from "../middlewares/authMiddleware";
const userProfileRouter = express.Router();

userProfileRouter.use(ValidateJWT)

//Get User profile
userProfileRouter.get("/profile", getUserProfile)

//Update User Profile
userProfileRouter.patch("/profile", updateUserProfile);

//Change Password
userProfileRouter.patch("/password", changePassword)

export default userProfileRouter