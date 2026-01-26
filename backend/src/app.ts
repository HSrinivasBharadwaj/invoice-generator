import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter);


app.listen(process.env.PORT,() => {
    console.log("Listening on port", process.env.PORT)
})