import mongoose from "mongoose";
import "../util/roles.js";
import User from "./user.js";
import property from "./property.js";
import deal from "./deal.js";
import roles from "../util/roles.js";

const managerSchema = new mongoose.Schema({
    properties: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "property"
    },
    deals: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "deal"
    },
    firstName: {
        type: String,
        required: false,
        minlength: 3
    },
    lastName: {
        type: String,
        required: false,
        minlength: 3
    },
    role: {
        type: String,
        default: roles.MANAGER,
        enum: [...Object.values(roles)]
    }
})


export default User.discriminator("manager",managerSchema)