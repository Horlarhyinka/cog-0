import mongoose from "mongoose";
import clientSchema from "./client.js";

const dealSchema = {
    client:{
        type: clientSchema,
        required: [true, "CLIENT INFO IS REQUIRED"]
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
    }
}

export default dealSchema