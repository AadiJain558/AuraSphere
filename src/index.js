import express from 'express'
import dotenv from 'dotenv';
import connectDB from './connect.js';
import auth from './routes/auth.js';
import { mongo } from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import './passport.js';
dotenv.config({path: './.env'});
const app = express()
connectDB()
.then(()=>{
  app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
  });
})
.catch((error)=>{
  console.log(error);
  process.exit(1);
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/aura/auth',auth);

