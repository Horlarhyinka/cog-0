import mongoose from "mongoose";
import user from "./user.js";
import property from "./property.js";
import dealSchema from "./deal.js";

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