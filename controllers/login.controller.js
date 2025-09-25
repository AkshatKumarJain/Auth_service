import User from "../models/user.model.js";
import { issueTokens, revokeAll, rotateRefreshToken } from "redis-jwt-auth";

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    const userId = findUser._id.toString();
    if(!findUser)
    {
        return res.status(400).json({
            message: "User doesn't exists."
        });
    }
    // check for password or otp. // will implement later.
    const checkPassword = await findUser.comparePassword(password);
    if(!checkPassword)
    {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }
    // if true
    //  const token = {accessToken, refreshToken};
    try {
       
        const {accessToken, refreshToken} = await issueTokens({ userId });
        console.log("access ", accessToken, "\n", "refresh ", refreshToken);
        if(accessToken && refreshToken)
        {
            return res.status(200).json({
                data: {userId, accessToken, refreshToken},
                message: "Logged in successful"
            });
        }

            res.status(403).json({
                message: "Please try again."
            })

    } catch (error) {
        res.status(500).json({
            message: error,
            stack: error.stack
        })
    }
}

// Revoke all refresh tokens for a user
export const logoutUser = async (req, res) => {
  
 const {userId} = req.body;

  // if userId is incorrect it will return bad request
  if (!userId)
    {
        return res.status(400).json({
            message: "No userId provided"
        });
    }

  // it will revoke all tokens for this user
  try {
      const revoked = await revokeAll(userId.toString());
      console.log(revoked);
      console.log(userId);
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
  } catch (error) {
    res.status(500).json({
        stack: error.stack
    })
  }
}

export const refreshUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if(!refreshToken)
        {
            return res.status(400).json({
                message: "either token is missing or wrong."
            })
        }
        const refresh = await rotateRefreshToken(refreshToken);
        if(!refresh)
        {
            return res.status(400).json({
                message: "couldn't refresh."
            })
        }
        res.status(200).json({
            data: refresh,
            message: "Success"
        })
    } catch (error) {
        res.status(500).json({
            message: error,
            stack: error.message
        })
    }
}
