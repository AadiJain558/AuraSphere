import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20'; // Directly import GoogleStrategy
import GitHubStrategy from 'passport-github2';
import { User } from './models/user.model.js';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            // Optionally, you can skip the password for OAuth users
            // password: 'dummyPassword' 
        });
        done(null, newUser);
    } catch (error) {
        done(error);
    }
}));


// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: '/auth/github/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//     try {
//         const existingUser = await User.findOne({ email: profile.emails[0].value });
//         if (existingUser) {
//             return done(null, existingUser);
//         }

//         const newUser = await User.create({
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             password: 'dummyPassword'
//         });
//         done(null, newUser);
//     } catch (error) {
//         done(error);
//     }
// }));
