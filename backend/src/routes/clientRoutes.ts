import express from "express";
import { ValidateJWT } from "../middlewares/authMiddleware";
import { createClient, getAllClients } from "../controllers/clientController";
const clientRouter = express.Router();

//Authentication was required
clientRouter.use(ValidateJWT)

//Post Client Data
clientRouter.post("/", createClient);

//Get All clients for logged in users
clientRouter.get("/", getAllClients)

export default clientRouter