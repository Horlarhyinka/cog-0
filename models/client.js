import mongoose from "mongoose";
import { emailRegex, telRegex } from "../util/regex.js";

const clientSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true
    },
     lastName : {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: emailRegex
    },
    address:{
        type: String,
        required: true
    },
    tel:{ 
        type: String,
        require:true,
        match: telRegex
    }
})

clientSchema.pre("save",function(){
    this.tel = this.tel?.replace(/[\-\s]/, "")
})

export default clientSchema;