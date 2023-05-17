import User from "../models/user.js";
import Admin from "../models/admin.js";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { createJWT } from "../utils/jwt.js"
import CustomError from "../errors/index.js"
import { StatusCodes } from "http-status-codes"
import { sendInvalidEntry } from "../util/responseHandlers.js"

dotenv.config();

const { SALT } = process.env;


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
    try{
        const user = await User.findOne({ email })
        
        if (!user) return sendInvalidEntry(res)
        // if login password doesn't match the original password .....
        const originalPassword = await user.comparePassword(password);

        if (!originalPassword)return sendInvalidEntry("Credentials");
        
        // accessToken
        const token = createJWT(user)
        const { isAdmin, ...info } = user._doc;  //Hide user password
        return res.status(StatusCodes.OK).json({ data: info, token });

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