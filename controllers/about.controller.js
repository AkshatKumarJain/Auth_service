import express from "express";
import User from "../models/user.model.js";

export const aboutUser = async (req, res) => {
    try {
        console.log(req.user)
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user in token" });
        }
        const {userId} = req.user;
        const findUser = await User.findById(userId);
        if(!findUser)
        {
            return res.status(400).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            data: findUser,
            message: "User found"
        })
    } catch (error) {
        res.status(500).json({
            message: error,
            stack: error.stack
        })
    }
}