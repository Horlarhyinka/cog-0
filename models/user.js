import mongoose from "mongoose";
import { emailRegex } from "../util/regex";

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

export default mongoose.model("user", userSchema);