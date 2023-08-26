
import mongoose from "mongoose";
import { emailRegex, telRegex } from "../util/regex.js";
import bcrypt from "bcrypt";
import roles from "../util/roles.js";
import deal from "./deal.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        match:  [emailRegex, "invalid email address"],
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password of minimum of 6 characters is required"]
    },
    firstName:{
        type: String,
        minlength: 3
    },
    lastName:{
        type: String,
        minlength: 3
    },
    tel: {
        type: String,
        match: [telRegex, "invalid telephone number"]
    },
    address: {
        type: String
    },
    deals: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "deal"
    },
    role: {
      type: String,
      enum:[roles.CLIENT, roles.MANAGER],
      default: roles.CLIENT
    }
})

userSchema.pre('save', async function (next) {
  let user = this
  this.tel = this.tel?.replace(/[\-\s]/, "")
//   this.role = this.role?.toUpperCase()
  if (user.isNew || user.isModified('password')) {
    const SALT = await bcrypt.genSalt(10)
   user.password = await bcrypt.hash(user.password, Number(SALT))
  }
  next()
 })

userSchema.methods.comparePassword = function (plainText) {
  return bcrypt.compare(plainText, this.password)
}
const user = mongoose.model("user", userSchema);

export default user

// export default {}