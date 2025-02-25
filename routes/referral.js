const express = require("express");
const User = require("../models/User");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// **Get Referred Users**
router.get("/", authMiddleware, async (req, res) => {
    try {   
        //const referredUsers = await User.find({ referredBy: req.user.userId }).select("username email");
        const referredUsers = await User.find({ referredBy: req.user.referralCode }).select("username email");

        console.log(referredUsers);
        res.json(referredUsers);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// **Referral Statistics**
router.get("/stats", authMiddleware, async (req, res) => {
    try {
        const referralsCount = await User.countDocuments({ referredBy: req.user.userId });
        res.json({ totalReferrals: referralsCount });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
