import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    try {
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if(password.length < 6)
        {
            return res.status(400).json({
                message: "Password must be of atleast 6 characters!"
            })
        }
        if(password.length > 15)
        {
            return res.status(400).json({
                message: "Password length cannit exceed 15 characters!"
            })
        }
        const findUser = await User.findOne({email});
        if(findUser)
        {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        if(password!==confirmPassword)
        {
            return res.status(400).json({
                message: "Password must be same as confirm password!"
            })
        }

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