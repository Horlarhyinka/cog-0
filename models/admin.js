import mongoose from "mongoose";
import user from "./user.js";
import property from "./property.js";
import { emailRegex } from "../util/regex.js";

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
        enum: ["PROSPECT", "RENTAL", "SALES", "AGREEMENT"],
        default: "PROSPECT"
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