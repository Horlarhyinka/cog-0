import mongoose from "mongoose";
import { emailRegex } from "../util/regex.js";
import _ from 'lodash'
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
    tel: {
        type: String
    },
    address: {
        type: String
    }
},{
    discriminatorKey: "kind"
})

const { SALT } = process.env;

userSchema.pre('save', async function (next) {
  let user = this
 
  if (user.isModified('password')) {
   user.password = await bcrypt.hash(user.password, Number(SALT))
  }
 
  next()
 })

userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compare(plainText, this.password)
}

export default mongoose.model("user", userSchema);
