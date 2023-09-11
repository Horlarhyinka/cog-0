import mongoose from "mongoose";
import payment_status from "../util/payment_status.js";

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [...payment_status],
        default: payment_status.UNPAID
    }
})

export default paymentSchema