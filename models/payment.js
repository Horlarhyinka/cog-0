import mongoose from "mongoose";
import payment_status from "../util/payment_status.js";

const paymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [...Object.values(payment_status)],
        default: payment_status.UNPAID
    }
})

export default paymentSchema