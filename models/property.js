import mongoose from "mongoose";
import property_types from "../util/property_types.js";

const locationSChema = new mongoose.Schema({
    country: {
        type: String,
        default: "Nigeria"
    },

    state: {
        type: String,
        required: true,
    },
    lga: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required:true
    },
    zip: {
        type: String
    }
})

const propertySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [...Object.values(property_types)]
    },
    location:{
        type: locationSChema
    },
    address: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: [true, "property image is required"],
        minlength: 1
    },
    available: {
        required: false,
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
})

propertySchema.pre("save",async function(){
    this.type = this.type.toUpperCase()
})

export default mongoose.model("property", propertySchema);