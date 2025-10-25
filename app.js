import express from "express";
import "dotenv/config.js"
import { connectDB } from "./connection.js"
// import User from "./models/user.model.js";
import router from "./routes/user.route.js";
import config from "redis-jwt-auth";
import cors from "cors"

import { authMiddleware, issueTokens, verifyAccessToken, requireHttps, rotateRefreshToken } from "redis-jwt-auth";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// Express example
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
}));


config.isProd = false;

connectDB();

app.use("/api/auth", router);

app.listen(port, () => {
    console.log(`The server is running at port ${port}.`);
})