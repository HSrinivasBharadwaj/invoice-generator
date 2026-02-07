import { Request, Response } from "express";
import { ValidateClientData, sanitizeString } from "../utils/validation";
import { prisma } from "../lib/prisma";


export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        //Get the client data from req.body
        const { name,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            taxNumber,
            notes } = req.body;
        const validation = ValidateClientData({
            name,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            taxNumber,
            notes
        });
        if (!validation.isValid) {
            res.status(400).json({ errors: validation.errors });
            return;
        }
        //Save the data to the db
        const client = await prisma.client.create({
            data: {
                userId: req.user.id,
                name: sanitizeString(name)!,
                email: sanitizeString(email),
                phone: sanitizeString(phone),
                address: sanitizeString(address),
                city: sanitizeString(city),
                state: sanitizeString(state),
                zipCode: sanitizeString(zipCode),
                country: sanitizeString(country),
                taxNumber: sanitizeString(taxNumber),
                notes: sanitizeString(notes)
            }
        })
        res.status(201).json({
            message: "Client created successfully",
            client: client
        });
    } catch (error) {
        console.error("Error while creating client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getAllClients = async(req: Request, res:Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const clients = await prisma.client.findMany({
            where: {
                userId: req.user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        res.status(200).json({
            message: "Clients fetched successfully",
            clients: clients,
            total: clients.length
        });
    } catch (error) {
        console.error("Error while creating client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}