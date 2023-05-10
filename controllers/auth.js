import User from "../models/user.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { createJWT } from "../utils/jwt.js"
import CustomError from "../errors/index.js"
import { StatusCodes } from "http-status-codes"
import Token from "../models/token.js"

dotenv.config();

const { SALT } = process.env;


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


const resetPasswordRequest = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})

        if (!user) {
            throw new CustomError.UnauthenticatedError({"message":"User email does not exist"})
        }
    
        const token = await Token.findOne({ userId: user._id })
        
        if (token) {
            await token.deleteOne()
        }

        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = bcrypt.hashSync(resetToken, Number(SALT));

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save()

        const link = `${process.env.CLIENT_URL}/resetPassword/userId=${user._id}?token=${resetToken}`;
        await sendEmail(user.email,"Password Reset",{  name: user.username, link: link,},"./template/requestResetPassword.handlebars");
        res.status(StatusCodes.OK).json(link);

    } catch (err) {
        next(err)
    }
}


const newPassword = async (req, res, next) => {
    try {
        const {password, token, userId} = req.body;
        // const resetToken = req.params.token 

        const passwordResetToken  = await Token.findOne({
            userId
        });

        if (!passwordResetToken) throw new CustomError.BadRequestError("Invalid link or expired");

        const isValid = bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            throw new CustomError.BadRequestError("Invalid or expired password reset token");
        }
      
        const hash = await bcrypt.hash(password,  Number(SALT));
      
        await User.findByIdAndUpdate(
            req.params.id,
          { $set: { password: hash }},
          { new: true }
        );

        const user = await User.findById({_id: userId})
        if (!user) {
            throw new CustomError.BadRequestError("invalid link or expired")
        };

        console.log(user)

        sendEmail(user.email, "Password Reset Successfully",{ name: user.name },"./template/resetPassword.handlebars");

        await passwordResetToken.delete();
            
        res.status(StatusCodes.OK).json({ message: "Password reset was successful" });
            
    } catch (error) {
        next(error);
        console.log(error)
    }

}


export {
    sign_up,
    login,
    resetPasswordRequest,
    newPassword
}