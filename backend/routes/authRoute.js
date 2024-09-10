import express from "express"
export const authRouter = express.Router();
import passport from "passport";
import "dotenv/config"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { router } from "./homeRoute.js";
import { User } from "../models/User.js"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { getUser } from "../middleware/authMiddleware.js";



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      FirstName: profile.name.givenName,
      LastName: profile.name.familyName,
      profileImage: profile.photos[0].value
    }
    try{  
      let user = await User.findOne({googleId:profile.id});
      if(user){
        done(null,user)
      }else{
        user=await User.create(newUser)
        done(null,user)
      }

    }catch(err){
      console.log(err)
    }
  }
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email','profile'],session:false }));
  
  router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/',
        // successRedirect: "/about",
        session:false
    }),
    (req,res)=>{
      try {
        const user = req.user;
        console.log(user)
        const payload = { id: user.id, displayName: user.displayName, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("cookie",token,{signed:true, sameSite:"none", secure:true,maxAge:"3600000"})
        // res.json({ message: 'Authentication successful',loggedIn:true});
        res.send('<script>window.close();</script>');
        // console.log(token)
        // res.redirect("http://localhost:5173")
      } catch (error) {
        console.error("Error generating JWT:", error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
    );

router.get("/loginFail",(req,res)=>{
    res.json({message:"google login fail"})
})

router.get("/logout",(req,res)=>{
  res.clearCookie("cookie", {
    signed: true,
    sameSite: "none",
    secure: true
  });
  res.json({ message: 'Logout successful' });
})

router.get("/manuallogin",async (req,res)=>{
  const {email,passwd} = req.query
  console.log(email,passwd)
  try{
    let result = await User.findOne({email:email,password:passwd})
    if(result){
      console.log(result)
      // res.json({message:"successful login",loggedIn:true})
      const payload = { id: result._id, displayName: (result.FirstName+result.LastName), email: result.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie("cookie",token,{signed:true, sameSite:"none", secure:true,maxAge:"3600000"})
      res.send({message:"ok"})
    }else{
      res.json({message:"no such user, redirecting to signup",loggedIn:false})
    }
  }catch(err){
    console.log(err)
  }

})

router.get("/auth/user",(req,res)=>{
  let token = req.signedCookies.cookie
  let user = getUser(token)
  console.log(user)
  if(!user){
    return res.json({message:"No logged in user",loggedIn:false})
  } 
    return res.json({message:"Logged in",loggedIn:true,user:user})
})

//set user data after successful auth
passport.serializeUser(function(user,done){
  done(null,user.id)
})

//retrieve user data from token
passport.deserializeUser(async function(id,done){
  try{

    const user = await User.findById(id)
  }catch(err){
    // console.log(err)
    done(err,null)
  }
})
