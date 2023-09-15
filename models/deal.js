import mongoose from "mongoose";
import clientSchema from "./client.js";
import stages from "../util/stages.js";
import "./offer.js";
import "./agreement.js";

const dealSchema = new mongoose.Schema( {
    client:{
        type: clientSchema,
        required: [true, "CLIENT INFO IS REQUIRED"]
    },
    stage: {
        type: String,
        enum: [...Object.values(stages)],
        default: stages.PROSPECT
    },
    note:{
        type: String,
        default: null
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'property'
    },
    units:{
        //awaiting units api implementation
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offer",
        default: null
    },
    agreement:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "agreement",
        default: null
    },
    isOnline: {
        type: Boolean,
        default: true
    }
})


export default mongoose.model("deal", dealSchema)
