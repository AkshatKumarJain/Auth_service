// import express from "express";
import express from "express";
import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const {name, email, password, confirmPassword} = req.body;
    try {
        const findUser = await User.findOne({email});
        if(findUser)
        {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const createdUser = await mongoose.create({ name, email, password, confirmPassword });
        if(password!==confirmPassword)
        {
            return res.status(400).json({
                message: "Password must be same as confirm password!"
            })
        }
        if(!createdUser)
        {
            return res.status(400).json({
                message: "cannot create user"
            })
        }
        if(createdUser)
        {
            return res.status(201).json({
                message: "User created successfully."
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}