import { Request, Response } from "express";
import { ValidateClientData, sanitizeString } from "../utils/validation";
import { prisma } from "../lib/prisma";
import { ensureUser } from "../utils/guards";


export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;
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

export const getAllClients = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;
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
        console.error("Error while fetching client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;
        const clientId = req.params.id as string; // ensure string type
        const client = await prisma.client.findUnique({
            where: {
                id: clientId
            }
        })
        if (!client) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        if (client.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        res.status(200).json({
            message: "Client fetched successfully",
            client: client
        });
    } catch (error) {
        console.error("Error while getting the client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;
        const clientId = req.params.id as string; // ensure string type
        // First, fetch the client to verify it exists and user owns it
        const client = await prisma.client.findUnique({
            where: {
                id: clientId
            }
        });
        if (!client) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        if (client.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        //Now delete the client
        await prisma.client.delete({
            where: {
                id: clientId
            }
        });

        res.status(200).json({
            message: "Client deleted successfully"
        });
    } catch (error) {
        console.error("Error while deleting client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;
        const clientId = req.params.id as string; // ensure string type
        const { name, email, phone, address, city, state, zipCode, country, taxNumber, notes } = req.body;
        //Check whether the client Id exists in db
        const client = await prisma.client.findUnique({
            where: {
                id: clientId
            }
        })
        if (!client) {
            res.status(404).json({ error: "Client not found" });
            return;
        }
        if (client.userId !== req.user.id) {
            res.status(403).json({ error: "Unauthorized access" });
            return;
        }
        const validationInput = {
            name: client.name,
            email,
            phone,
            address,
            city,
            state,
            zipCode,
            country,
            taxNumber,
            notes
        }
        const validation = ValidateClientData(validationInput);
        if (!validation.isValid) {
            res.status(400).json({ errors: validation.errors });
            return;
        }
        const updateData: Record<string, string | null> = {};
        if (email !== undefined) updateData.email = sanitizeString(email);
        if (phone !== undefined) updateData.phone = sanitizeString(phone);
        if (address !== undefined) updateData.address = sanitizeString(address);
        if (city !== undefined) updateData.city = sanitizeString(city);
        if (state !== undefined) updateData.state = sanitizeString(state);
        if (zipCode !== undefined) updateData.zipCode = sanitizeString(zipCode);
        if (country !== undefined) updateData.country = sanitizeString(country);
        if (taxNumber !== undefined) updateData.taxNumber = sanitizeString(taxNumber);
        if (notes !== undefined) updateData.notes = sanitizeString(notes);
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ error: "No updatable fields provided" });
            return;
        }
        const updatedClient = await prisma.client.update({
            where: {
                id: clientId
            },
            data: updateData
        })
        res.status(200).json({
            message: "Client updated successfully",
            client: updatedClient,
            changedFields: Object.keys(updateData)
        });
    } catch (error) {
        console.error("Error while updating client:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}