import mongoose from "mongoose";
import clientSchema from "./client.js";
import paymentSchema from "./payment.js";

const agreementSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    client: {
        type: clientSchema,
        required: true
    },
    payment: {
        type: paymentSchema
    }
})

export default mongoose.model("agreement", agreementSchema)