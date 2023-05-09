import dotenv from "dotenv"
import { createJWT } from "../utils/jwt.js"
import CustomError from "../errors/index.js"
import { StatusCodes } from "http-status-codes"
import User from "../models/users.js"

dotenv.config();



const sign_up = async (req, res, next) => {
    const { email } = req.body;
    try {
        const emailExisted = await User.findOne({ email })
        
        if(emailExisted) {
            throw new CustomError.BadRequestError("Email already exists")
        }
        const new_user = new User({
            username:req.body.username,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber
        });

        const token = createJWT(new_user);

        const user = await new_user.save();

        user.password = undefined

        res.status(StatusCodes.CREATED).json({ user: user, token})
    } catch (err) {
        next(err)
    }
}

// Login user
const login = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email })
        
        if (!user) {
            throw new CustomError.UnauthenticatedError("Please provide email and password");
        }
        // if login password doesn't match the original password .....
        const originalPassword = await user.comparePassword(password);

        if (!originalPassword) {
            throw new CustomError.UnauthenticatedError("Invalid Credentials");
        }
        
        // accessToken
        const token = createJWT(user)
        const { isAdmin, ...info } = user._doc;  //Hide user password
        
        res.status(StatusCodes.OK).json({ data: info, token });

    } catch(err) {
        next(err)
    }
}


export {
    sign_up,
    login
}