import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;
const prisma = new PrismaClient()

//Modify the express Request to add the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string | null;
                companyName: string | null;
                companyAddress: string | null;
                companyPhone: string | null;
                logoUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            }
        }
    }
}

export const ValidateJWT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]
        if (!token) {
            res.status(401).json({ error: "Authentication required. Please log in." });
            return;
        }
        //Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
        //Get User from decoded object
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                companyAddress: true,
                companyPhone: true,
                logoUrl: true,
                createdAt: true,
                updatedAt: true,
            }
        })
        if (!user) {
            res.status(401).json({ error: "Invalid token. User not found." });
            return;
        }
        req.user = user
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: "Token expired. Please log in again." });
            return;
        }
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}