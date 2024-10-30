import passport from "passport";
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import User from './models/user.model.js';
passport.serializeUser((user, done) => {
    done(null, user.id);
}
);
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    }
    );
}
);
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
            password: 'dummyPassword' // Use a dummy password or generate a secure one
        });
        done(null, newUser);
    } catch (error) {
        done(error);
    }
}));


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: 'dummyPassword'
        });
        done(null, newUser);
    } catch (error) {
        done(error);
    }
}));
