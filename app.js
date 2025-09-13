import express from "express";
import "dotenv/config.js"
import { connectDB } from "./connection.js"
import User from "./models/user.model.js";

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.listen(port, () => {
    console.log(`The server is running at port ${port}.`);
})