import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        // min: [6, "Password must contain atleast 6 characters."],
        // max: [15, "Password cannot contain more than 15 characters."]
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiresAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpiresAt: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["guest", "host", "admin"],
        default: "guest"
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (pass) {
    return bcrypt.compare(pass, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;