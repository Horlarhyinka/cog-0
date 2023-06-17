import mongoose from "mongoose";
import user from "./user.js";
import property from "./property.js";
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

const dealSchema = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        match: emailRegex
    },
    tel: {
        type: String,
    },
    status: {
        type: String,
        enum: ["PROSPECT", "RENTAL", "SALES", "AGREEMENT", "LEASE"],
        default: "PROSPECT"
    },
    description:{
        type: String
    },
    property: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'property'
    },
    client:{
        type: [clientSchema]
    }
}

const adminSchema = new mongoose.Schema({
    properties: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "property"
    },
    deals: {
        type: [dealSchema]
    }
})

export default user.discriminator("admin", adminSchema)