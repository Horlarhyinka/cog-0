import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv"
dotenv.config()

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET, 
    callbackURL: process.env.BASE_URL + "/auth/redirect",
    passReqToCallback: true
},async(req, accessToken, refreshToken, profile, done)=>{
    const {id: password} = profile
    const {email, given_name: firstName, family_name: lastName} = profile._json
    let user;
    const existing = await User.findOne({email})
    if(!existing){
        const user = await User.create({firstName, lastName, email, password})
        return done(undefined, user)
    }
    const validatePassword = existing.comparePassword(password)
    if(!validatePassword)return done("user not found", undefined)
    return done(undefined, existing)
})
)

passport.serializeUser(function(user, done){
    return done(undefined, user._id)
})

passport.deserializeUser(async function(id, done){
    if(!id)return done("user not found", undefined)
    const user = await User .findById(id)
    if(!user) return done("user not found", undefined)
    return done(undefined, user)
})

export const useGoogleAuth = passport.authenticate("google",{scope:["profile", "email"]})