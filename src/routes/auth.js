import express from "express";
import { Router } from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import {upload} from "../middleware/multer.js";
import { uploadToCloudinary } from "../utils/uploadcloud.js";

const router = Router();

router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 }]), async (req, res) => {
        const { email, password, username } = req.body;
        // console.log(req.body);
        try {
            const avatarlocalpath = req.files?.avatar[0]?.path;
            console.log("avatarlocalpath:", avatarlocalpath);
            if (!avatarlocalpath) {
                throw new ApiError(400, "Avatar is required");
            }
            const avatar = await uploadToCloudinary(avatarlocalpath);
            if (!avatar) {
                throw new ApiError(500, "Image upload failed");
            }
            const userExists = await User.findOne({ email });
            // console.log("Query executed, userExists:", userExists);
            // Continue with the rest of your logic
            if (userExists) return res.status(400).json({ message: 'User already exists' });

            const user = await User.create({ username, email, avatar: avatar.url, password });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const createduser = await User.findById(user._id).select(
                "-password"
            )
            if (!createduser) {
                throw new ApiError(500, "User creation failed");
            }

            res.status(201).json({ message: 'User created', token });
        } catch (err) {
            console.error("Error with User.findOne:", err.message);
        }
    })
router.route("/login").post(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

import passport from 'passport';
// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback route for Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/'); // Redirect to your frontend or a success page
    }
);

// Auth with GitHub

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));


// GitHub callback route
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/'); // Redirect to a frontend route or success page
    }
);

export default router;