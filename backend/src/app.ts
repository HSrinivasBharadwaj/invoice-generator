import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import userProfileRouter from './routes/userProfileRoutes';
const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", userProfileRouter);


app.listen(process.env.PORT,() => {
    console.log("Listening on port", process.env.PORT)
})