import Joi from "joi"

export const validatePropertyInfo = (data) =>Joi.object({
    type: Joi.string().min(3).max(255).required(),
    location: Joi.object({
        state: Joi.string().required(),
        lga: Joi.string().required(),
        zip: Joi.string().required()
    }).required(),
    price: Joi.number().required()
}).validate(data)