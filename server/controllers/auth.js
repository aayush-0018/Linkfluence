import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(req.body);

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, password: hashedPassword, role });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
};
