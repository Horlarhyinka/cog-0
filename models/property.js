import mongoose from "mongoose";

const locationSChema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
    },
    lga: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    }
})

const propertySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location:{
        type: locationSChema
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: [String],
        required: [true, "property image is required"],
        minlength: 1
    }
})

export default mongoose.model("property", propertySchema);