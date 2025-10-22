import User from "../models/user.model.js";
import transporter from "../config/nodemailer.config.js";

export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    try {

        // every given field is necessary
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if the length of password is atleast 5 characters.
        if(password.length < 6)
        {
            return res.status(400).json({
                message: "Password must be of atleast 6 characters!"
            })
        }

        // check if the length of password exceed 15 characters.
        if(password.length > 15)
        {
            return res.status(400).json({
                message: "Password length cannit exceed 15 characters!"
            })
        }

        // check if the user with given email is already registerd.
        const findUser = await User.findOne({email});
        if(findUser)
        {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // password and confirmPassword must be same
        if(password!==confirmPassword)
        {
            return res.status(400).json({
                message: "Password must be same as confirm password!"
            })
        }

        // create a new user.
        const createdUser = new User({ username, email, password });
        if(!createdUser)
        {
            return res.status(400).json({
                message: "cannot create user"
            })
        }
        console.log(password, " ",confirmPassword);
        await createdUser.save();
        console.log(password, " ",confirmPassword);

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${username} to stayFinder.`,
            text: `Welcome to stayFinder. Your account has been created with email id: ${email}.`
        }

        const mail = await transporter.sendMail(mailOptions);
        if(!mail)
        {
            console.log("couldn't send mail");
        }


        res.status(201).json({
            data: createdUser,
            message: "User created successfully."
        })
    } catch (error) {
        res.status(500).json({
            message: "error", error,
            stack: error.stack
        })
    }
}


// registration successful email be be sent to user's email.