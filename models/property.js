import mongoose from "mongoose";

const locationSChema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
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
    }
})

export default mongoose.model("property", propertySchema);