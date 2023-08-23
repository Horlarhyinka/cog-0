import mongoose from "mongoose";
import { emailRegex, telRegex } from "../util/regex.js";

const clientSchema = new mongoose.Schema({
    firstName : {
        type: String
    },
     lastName : {
        type: String
    },
    email: {
        type: String,
        match: emailRegex,
        required: true
    },
    address:{
        type: String
    },
    tel:{ 
        type: String,
        match: telRegex
    }
})

clientSchema.pre("save",function(){
    this.tel = this.tel?.replace(/[\-\s]/, "")
})

export default clientSchema;