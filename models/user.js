import mongoose from "mongoose";
import { emailRegex } from "../util/regex";
import mongoose from "mongoose";
import _ from 'lodash'
import bcryptjs from "bcrypt-js";

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
        type: string
    }
},{
    discriminatorKey: "kind"
})

const { SALT } = process.env;

userSchema.pre('save', async function (next) {
  let user = this
 
  if (user.isModified('password')) {
   user.password = await bcryptjs.hashSync(user.password, Number(SALT))
  }
 
  next()
 })


UserSchema.methods.comparePassword = async function (plainText) {
  const isMatch = await bcryptjs.compare(plainText, this.password)
  return isMatch
}


export default mongoose.model("user", userSchema);
