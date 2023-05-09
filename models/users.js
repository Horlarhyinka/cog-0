import mongoose from "mongoose";
import _ from 'lodash'
import bcrypt from "bcryptjs"

const { SALT } = process.env;

const UserSchema = new mongoose.Schema({
    username: {type:String, require: true, min: 3, max: 32},
    email: {type:String, require: true, max: 42, unique: true},
    password: { type: String, require: true, min: 6, max: 20 },
    phoneNumber: { type: String, required: true },
    isAdmin: { type: Boolean, default: false},
}, { timestamps: true })


UserSchema.pre('save', async function (next) {
  let user = this
 
  if (user.isModified('password')) {
   user.password = await bcrypt.hashSync(user.password, Number(SALT))
  }
 
  next()
 })


UserSchema.methods.comparePassword = async function (plainText) {
  const isMatch = await bcrypt.compare(plainText, this.password)
  return isMatch
}


export default mongoose.model("User", UserSchema);
