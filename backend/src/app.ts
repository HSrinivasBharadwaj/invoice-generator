import express from "express";
import "dotenv/config";
import cors from 'cors';
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import userProfileRouter from './routes/userProfileRoutes';
import clientRouter from "./routes/clientRoutes";
import invoiceRouter from "./routes/invoiceRoutes";
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',  //Your frontend URL
    credentials: true,  // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userProfileRouter);
app.use("/api/clients", clientRouter);
app.use("/api/invoices", invoiceRouter)


app.listen(process.env.PORT,() => {
    console.log("Listening on port", process.env.PORT)
})