import express from "express";
import "dotenv/config.js"
import { connectDB } from "./connection.js"
// import User from "./models/user.model.js";
import router from "./routes/user.route.js";
import config from "redis-jwt-auth";

import { authMiddleware, issueTokens, verifyAccessToken, requireHttps, rotateRefreshToken } from "redis-jwt-auth";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

config.isProd = false;

connectDB();

app.use(router);



app.listen(port, () => {
    console.log(`The server is running at port ${port}.`);
})