import mongoose from "mongoose";
import { emailRegex, telRegex } from "../util/regex.js";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match:  emailRegex,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    tel: {
        type: String,
        match: telRegex
    },
    address: {
        type: String
    },
    resetToken:{
        type: String
    },
    tokenExpiresIn:{
        type: Date
    },
    avatar:{
        type: String
    }
},{
    discriminatorKey: "kind"
})

userSchema.pre('save', async function (next) {
  let user = this
  if (user.isNew || user.isModified('password')) {
    const SALT = await bcrypt.genSalt(10)
   user.password = await bcrypt.hash(user.password, Number(SALT))
  }
  next()
 })

userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compare(plainText, this.password)
}

export default mongoose.model("user", userSchema);

