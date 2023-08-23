import Joi from "joi"
import mongoose from "mongoose"
import { emailRegex, telRegex } from "./regex.js"

export const validatePropertyInfo = (data) =>Joi.object({
    type: Joi.string().min(3).max(255).required(),
    location: Joi.object({
        country: Joi.string(),
        state: Joi.string().required(),
        lga: Joi.string().required(),
        zip: Joi.string(),
        landmark: Joi.string().required()
    }).required(),
    price: Joi.number().required(),
    address: Joi.string().required()
}).validate(data)

export const validateClient = data =>Joi.object({
    email: Joi.string().required().regex(emailRegex),
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    tel: Joi.string().regex(telRegex),
    address: Joi.string().min(6).max(255)
}).validate(data)

export const validateId = (id) =>mongoose.Types.ObjectId.isValid(String(id))