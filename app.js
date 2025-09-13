import express from "express";
import "dotenv/config.js"

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("Hello");
})

app.listen(port, () => {
    console.log(`The server is running at port ${port}.`);
})