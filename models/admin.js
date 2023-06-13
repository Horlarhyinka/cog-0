import mongoose from "mongoose";
import user from "./user.js";
import property from "./property.js";
import { emailRegex } from "../util/regex.js";

const clientSchema = {
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
        Type: String,
        required: true
    },
    tel:{ 
        type: String,
        require:true
    }
}

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
        [mongoose.Schema.Types.ObjectId],
        ref: 'property'
    },
    client:{
        [mongoose.Schema.Types.ObjectId],
        ref: 'client'
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