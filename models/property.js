import mongoose from "mongoose";

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
    }
})

const propertySchema = new mongoose.Schema({

    type: {
      type: String,
      required: true,
      enum: ['Bungalow', 'BUNGALOW', 'bungalow', 'Detatched', 'DETATCHED', 'detatched', 'Semi-detatched', 'SEMI-DETACHED', 'OTHERS', 'Others', 'others;]
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
    available:{
        required: false,
        type: Boolean,
      default: true
    },
    isFeatured: {
    type: Boolean,
     default: false
    }
})

export default mongoose.model("property", propertySchema);