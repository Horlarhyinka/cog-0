import mongoose from "mongoose";
import property from "./property.js";

const offerSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "property",
        required: true
    },
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "deal",
        required: false
    }
},{
    timestamps: true
})

export default mongoose.model("offer", offerSchema)