import mongoose from "mongoose";
import clientSchema from "./client.js";
import statuses from "../util/statuses.js";
import property from "./property.js";

const dealSchema = new mongoose.Schema({
    client:{
        type: clientSchema,
        required: [true, "CLIENT INFO IS REQUIRED"]
    },
    status: {
        type: String,
        enum: [statuses.PROSPECT, statuses.RENTAL, statuses.SALES, statuses.AGREEMENT, statuses.LEASE],
        default: statuses.PROSPECT
    },
    description:{
        type: String
    },
    property: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'property'
    }
})

dealSchema.pre("save",function(){
    this.status = this.status.toUpperCase()
})

export default dealSchema