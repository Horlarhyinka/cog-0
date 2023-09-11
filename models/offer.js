import mongoose from "mongoose";
import property from "./property.js";

const offerSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    note: {
        type: Number,
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
})

export default mongoose.model("offer", offerSchema)