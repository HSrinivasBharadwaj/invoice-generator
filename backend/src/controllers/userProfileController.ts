import { Request, Response } from "express";
import { sanitizeString } from "../utils/validation";
import { prisma } from "../lib/prisma";

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            user: req.user
        });
    } catch (error) {
        console.error("Get user profile error:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        //Get the data from request body
        const { email, name, companyName, companyAddress, companyPhone, logoUrl } = req.body;
        if (email) {
            res.status(403).json({
                error: "Email cannot be changed. Please contact support if you need to update your email."
            });
            return;
        }
        // Validate: At least one field should be provided
        if (!name && !companyName && !companyAddress && !companyPhone && !logoUrl) {
            res.status(400).json({
                error: "At least one field is required to update"
            });
            return;
        }
        //Update User in db
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name: name !== undefined ? sanitizeString(name) : req.user.name,
                companyName: companyName !== undefined ? sanitizeString(companyName) : req.user.companyName,
                companyAddress: companyAddress !== undefined ? sanitizeString(companyAddress) : req.user.companyAddress,
                companyPhone: companyPhone !== undefined ? sanitizeString(companyPhone) : req.user.companyPhone,
                logoUrl: logoUrl !== undefined ? (logoUrl?.trim() || null) : req.user.logoUrl
            },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                companyAddress: true,
                companyPhone: true,
                logoUrl: true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}