import { Request, Response } from "express";
import { sanitizeString } from "../utils/validation";
import bcrypt from 'bcryptjs';
import { prisma } from "../lib/prisma";
import { ensureUser } from "../utils/guards";

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!ensureUser(req, res)) return;

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
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        // Validation
        if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
            res.status(400).json({ 
                error: "Current password and new password are required and must be strings" 
            });
            return;
        }
        if (newPassword.length < 8) {
            res.status(400).json({ 
                error: "New password must be at least 8 characters long" 
            });
            return;
        }
        if (currentPassword === newPassword) {
            res.status(400).json({ 
                error: "New password must be different from current password" 
            });
            return;
        }
        //Fetch the user with password
        const userWithPassword = await prisma.user.findUnique({
            where: {id: req.user.id},
            select: {
                id: true,
                password: true 
            }
        })
        if (!userWithPassword) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        //Verify Current Password
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword, 
            userWithPassword.password
        );
        if (!isCurrentPasswordValid) {
            res.status(401).json({ 
                error: "Current password is incorrect" 
            });
            return;
        }
    
        const hashedPassword = await bcrypt.hash(newPassword,10);
        //Store in db
        await prisma.user.update({
            where: {id: req.user.id},
            data: { 
                password: hashedPassword 
            }
        })
        res.status(200).json({
            message: "Password changed successfully"
        }); 
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const deleteAccount = async(req:Request, res:Response) : Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Not authenticated" });
            return;
        }
        const deletedUser = await prisma.user.delete({
            where: {id: req.user.id},
            select: { id: true, email: true }
        })
        res.status(200).json({
            message: "Account deleted successfully",
            data: deletedUser
        }); 
    } catch (error) {
        console.error("Delete account error:", error);
        if (error instanceof Error && error.message.includes('not found')) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}