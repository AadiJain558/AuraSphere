// routes/leaderboardRoutes.js
import express from "express";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js"; // Assume Course model is created
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Campus-wide leaderboard
router.get("/campus-leaderboard", protect, async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .sort({ aurapoints: -1 }) // Sort by Aura points in descending order
            .limit(10) // Limit to top 10
            .select("username aurapoints profilePicture"); // Select relevant fields

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Course-specific leaderboard
router.get("/course-leaderboard/:courseId", protect, async (req, res) => {
    const { courseId } = req.params;

    try {
        // Find users enrolled in the specified course and sort by Aura points
        const leaderboard = await User.find({ enrolledCourses: courseId }) // Assume "enrolledCourses" in User model
            .sort({ aurapoints: -1 })
            .limit(10)
            .select("username aurapoints profilePicture");

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
