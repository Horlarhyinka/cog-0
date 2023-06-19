import User from "../models/user.js";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { createJWT } from "../util/jwt.js"
import CustomError from "../errors/index.js"
import { StatusCodes } from "http-status-codes"
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers.js"
import catchAsync from "../util/catchAsync.js";
import Mailer from "../services/mailer.js";
import crypto from "crypto";

dotenv.config();

const sign_up = async (req, res, next) => {
    try {
        let user;
            if(req.body.isAdmin){
               user = await Admin.create({ ...req.body }) 
            }else{
                user = await User.create({ ...req.body })
            }
            const token = createJWT(user);
            user.password = undefined
            return res.status(StatusCodes.CREATED).json({ user, token})
    } catch (err) {
        if(err.code == 11000)return res.status(409).json({message: "email is taken"})
        if(err._message?.toLowerCase().includes("user validation failed")){
        const errors = Object.keys(err.errors).map(key =>err.errors[key]?.properties?.message)
        if(errors.length > 0)return res.status(400).json({message: errors.join("\n").replace(/path/ig, "")})
        }
        next(err)
    }
}

// Login user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password)return sendMissingDependency(res, "email and password")
    try{
        const user = await User.findOne({ email })
        if (!user) return sendResourceNotFound(res, "user")
        // if login password doesn't match the original password .....
        const validatePassword = await user.comparePassword(password);
        if (!validatePassword)return sendInvalidEntry(res, "Credentials");
        // accessToken
        const token = createJWT(user)
        user.password = undefined;
        return res.status(StatusCodes.OK).json({ user, token });
    } catch(err) {
        next(err)
    }
}

const resetPasswordRequest = async (req, res, next) => {
    const {email} = req.body;
    if(!email)return sendMissingDependency(res, "email")
    try {
        const user = await User.findOne({email})
        if (!user)return sendResourceNotFound(res, "user")
        let resetToken = crypto.randomBytes(32).toString("hex");
        const link = `${process.env.APP_UI_URL}/resetPassword/?token=${resetToken}`;
        user.resetToken = resetToken;
        user.tokenExpiresIn = new Date(Date.now() + 1000*60*60*2) //token expires in 2hrs
        await user.save()
        const mailer = new Mailer(email)
        await mailer.sendPasswordResetMail(link)
        return res.status(StatusCodes.OK).json({message: "check "+ email + " to complete password reset process"});
    } catch (err) {
        next(err)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const {password, confirmPassword} = req.body;
        if(password !== confirmPassword)return res.status(400).json({message: "password and confirm password must be the same"})
        const {token} = req.params
        if(!token)return sendMissingDependency(res, "token")
        const user = await User.findOneAndUpdate({resetToken: token, tokenExpiresIn: {$gte: new Date()}},{password}, {new: true})
        if(!user)return sendResourceNotFound(res, "user")
        user.password = undefined;
        return res.status(200).json({user, token: createJWT(user)})
    } catch (error) {
        throw error
    }

}

const oauthRedirect = catchAsync(async(req, res)=>{
    const {user} = req
    if(!user)return sendResourceNotFound(res, "user");
    const token = createJWT(user)
    user.password = undefined
    const data = {user, token}
    res.cookie("cog",data)
    return res.status(200).json(data)
})

// User.deleteMany({}).then(res=>console.log("done deleting"))

export {
    sign_up,
    login,
    resetPasswordRequest,
    resetPassword,
    oauthRedirect
}