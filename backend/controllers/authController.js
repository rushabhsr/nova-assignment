import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// @desc Register a new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "user",
        });

        if (user) {
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id, user.role),
                },
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                message: "Login Successful!",
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id, user.role),
                },
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Validate JWT Token
// @route GET /api/auth/validate
const validateToken = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            const user = await User.findById(decoded.id).select("-password -__v -_id");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({
                message: "Token is valid",
                user,
            });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { registerUser, loginUser, validateToken };
