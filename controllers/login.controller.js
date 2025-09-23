import User from "../models/user.model.js";
import { issueTokens, revokeAll } from "redis-jwt-auth";

export const loginUser = async (req, res) => {
    const findUser = await User.find({ email });
    const payload = findUser._id;
    if(!findUser)
    {
        return res.status(400).json({
            message: "User doesn't exists."
        });
    }
    // check for password or otp. // will implement later.

    // if true
    try {
        const token = {accessToken, refreshToken};
        token = await issueTokens({ payload });
        console.log(token);
        if(!token)
        {
            return res.status(403).json({
                message: "Please try again."
            })
        }

        res.status(200).json({
            message: "Logged in successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

// Revoke all refresh tokens for a user
export const logoutUser = async (req, res) => {
  
  const { userId } = req.body;

  // if userId is incorrect it will return bad request
  if (!userId)
    {
        return res.status(400).json({
            message: "No userId provided"
        });
    }

  // it will revoke all tokens for this user
  const revoked = await revokeAll(userId);

  // if somethig goes wrong it will return no token found for this user
  if (!revoked)
  { 
        return res.status(404).json({ 
            error: "No tokens found for this user" 
        }); 
  }
  res.status(200).json({
    message: `Revoked all tokens for user ${userId}`
  })
}
