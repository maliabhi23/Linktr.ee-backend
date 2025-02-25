const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();

const generateReferralCode = (username) => username + Math.floor(Math.random() * 10000);

// **User Registration**
console.log("in the auth.js");
router.post("/register", async (req, res) => {
    console.log("method inside router register")
    const { username, email, password, referralCode } = req.body;

    try {
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
   
            referralCode: generateReferralCode(username),
            referredBy: referralCode || null
        });
        // console.log("Generated Referral Code:", referralCode);

        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// **User Login**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
