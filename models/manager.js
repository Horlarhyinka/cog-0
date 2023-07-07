import mongoose from "mongoose";
import "../util/roles.js";
import User from "./user.js";
import property from "./property.js";
import dealSchema from "./deal.js";
import roles from "../util/roles.js";

const managerSchema = new mongoose.Schema({
    properties: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "property"
    },
    deals: {
        type: [dealSchema]
    },
    role: {
        type: String,
        default: roles.MANAGER,
        enum: [...Object.values(roles)]
    }
})


export default User.discriminator("manager",managerSchema)