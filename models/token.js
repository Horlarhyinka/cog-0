import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    token:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model("token", tokenSchema)