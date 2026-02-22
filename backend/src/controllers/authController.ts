import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { ValidateLoginData, ValidateSignUpData, sanitizeString } from "../utils/validation";
import { prisma } from "../lib/prisma";



// JWT_SECRET must match jsonwebtoken.Secret type (string | Buffer)
const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as jwt.Secret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string; // keeps string for expiresIn option

export const Signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, companyName, companyAddress, companyPhone, logoUrl } = req.body;
        //Validate the req body before storing to the db
        const validation = ValidateSignUpData({
            email,
            password,
            name,
            companyName,
            companyAddress,
            companyPhone,
            logoUrl
        })
        if (!validation.isValid) {
            res.status(400).json({ errors: validation.errors });
            return;
        }
        //Find whether the user exists in db if yes dont save the user
        const findExistingUser = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        })
        if (findExistingUser) {
            res.status(409).json({ error: "Email already exists" });
            return;
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Save the user to the db
        const user = await prisma.user.create({
            data: {
                email: email.trim().toLowerCase(),
                password: hashedPassword,
                name: sanitizeString(name),
                companyName: sanitizeString(companyName),
                companyAddress: sanitizeString(companyAddress),
                companyPhone: sanitizeString(companyPhone),
                logoUrl: logoUrl?.trim()
            }
        })
        //Return the user with password
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const Login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const validation = ValidateLoginData({ email, password });
        if (!validation.isValid) {
            res.status(400).json({ errors: validation.errors });
            return;
        }
        //Find whether the user exists in db if yes then proceed to login
        const findExistingUser = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        })
        if (!findExistingUser) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, findExistingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        //Sign in the jwt
        const token = jwt.sign(
            { id: findExistingUser.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } // jwt.SignOptions accepts string here
        );
        //Set the token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            // if the frontend is on a different origin and we're in prod, allow cross-site cookie
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 , // 7 days in milliseconds
            // always secure - browsers will ignore it over HTTP but it protects in production
            secure: process.env.NODE_ENV === "production" || true,
        })
        // Return user data (NOT password)
        const { password: _, ...userWithoutPassword } = findExistingUser;
        res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const Logout = (req: Request, res: Response): void => {
    try {
        res.clearCookie("token",{
            httpOnly: true,
            sameSite: "strict"
        })
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ error: "Failed to logout" });
    }
}