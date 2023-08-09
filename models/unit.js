import mongoose from "mongoose";
import property from "./property.js";


const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    availableFor: {
        type: String,
        enum:["rental", "sale"," lease"]
    },
    price: {
        type: Number,
        required: true
    },
    unitNumber: [
        {
         number: Number
          
        }
    ],
    description: {
        type:String,
        required:true
    }
})


export default mongoose.model("Unit", UnitSchema)