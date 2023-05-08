import mongoose from "mongoose";
import User from "./user";
import property  from "./property";

const ownerSchema = new mongoose.Schema({
    properties: {
        type: mongoose.Types.ObjectId,
        ref: "property"
    },
})

export default User.discriminator("owner", ownerSchema);