import express from "express";
import { ValidateJWT } from "../middlewares/authMiddleware";
import { createClient, getAllClients, getClientById, deleteClientById } from "../controllers/clientController";
const clientRouter = express.Router();

//Authentication was required
clientRouter.use(ValidateJWT)

//Post Client Data
clientRouter.post("/", createClient);

//Get All clients for logged in users
clientRouter.get("/", getAllClients)

//Get Client By ID
clientRouter.get("/:id", getClientById)

//Delete Client by ID
clientRouter.delete("/:id", deleteClientById)

export default clientRouter