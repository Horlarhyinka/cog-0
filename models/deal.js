import mongoose from "mongoose";
import clientSchema from "./client.js";

const dealSchema = new mongoose.Schema( {
    client:{
        type: clientSchema,
        required: [true, "CLIENT INFO IS REQUIRED"]
    },
    status: {
        type: String,
        enum: [...Object.values(statuses)],
        default: statuses.PROSPECT
    },
    description:{
        type: String
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property'
    },
    units:{
        //awaiting units api implementation
    }
})

dealSchema.pre("save",function(){
    this.status = this.status.toUpperCase()
})

export default mongoose.model("deal", dealSchema)
