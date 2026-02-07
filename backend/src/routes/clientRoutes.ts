import express from "express";
import { ValidateJWT } from "../middlewares/authMiddleware";
import { createClient, getAllClients, getClientById } from "../controllers/clientController";
const clientRouter = express.Router();

//Authentication was required
clientRouter.use(ValidateJWT)

//Post Client Data
clientRouter.post("/", createClient);

//Get All clients for logged in users
clientRouter.get("/", getAllClients)

//Get Client By ID
clientRouter.get("/:id", getClientById)

export default clientRouter