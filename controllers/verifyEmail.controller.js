import express from "express"
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.config.js";

// send verification otp to user's email.
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.userId;
        if(!userId)
            return res.status(400).json({
                    message: "give userId"
            })

        const findUser = await User.findById(userId);
        if(!findUser)
        {
            return res.status(404).json({
                message: "Invalid user"
            })
        }

        if(findUser.isAccountVerified)
        {
            return res.status(401).json({
                message: "Account already verified"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        findUser.verifyOtp = otp;
        findUser.verifyOtpExpiresAt = Date.now() + 300 * 1000;

        await findUser.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: findUser.email,
            subject: "Account verification otp",
            text: `Your otp is ${otp}. Verify your account using this otp.` 
        }

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Verification otp send"
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}


// verify the email

export const verifyEmail = async (req, res) => {
    const userId = req.user.userId;
    const {otp} = req.body;
    if(!userId || !otp)
    {
        return res.status(400).json({
            message: "Missing details."
        })
    }
    try {
            const findUser = await User.findById(userId);
    if(!findUser)
    {
        return res.status(400).json({
            message: "User not found"
        })
    }

    if(findUser.verifyOtp==="" || findUser.verifyOtp!==otp)
    {
        return res.status(401).json({
            message: "Invalid or empty otp"
        })
    }

    if(findUser.verifyOtpExpiresAt < Date.now())
    {
        return res.status(401).json({
            message: "otp has been expired"
        })
    }
    findUser.isAccountVerified = true;
    findUser.verifyOtp = "";
    findUser.verifyOtpExpiresAt = 0;
    await findUser.save();
    res.status(200).json({
        message: "email verification successfull"
    })
    } catch (error) {
        res.status(500).json({
            message: error,
            stack: error.stack
        })
    }
}