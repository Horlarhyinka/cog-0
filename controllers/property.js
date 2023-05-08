import Property from "../models/property.js";
import catchAsync from "../util/catchAsync.js";
import { paginate } from "../util/funcs.js";
import { sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers.js";
import { validatePropertyInfo } from "../util/validators.js";


export const getProperties = catchAsync(async(req, res)=>{
    const {location} = req.query;
    const {page, size} = req.query;
    if(!location){
        const properties = await Property.find()
        if(page && size)return res.status(200).json(paginate(properties, page, size))
        return res.status(200).json(properties)
    }
    let properties = await Property.find()
        const filtered = properties.filter(({lga, state})=>location.includes(lga) || location.includes(state))
        properties = filtered
    if(page && size)return res.status(200).json(paginate(properties, page, size))
    return res.status(200).json(properties)
})

export const getProperty = catchAsync(async(req, res)=>{
    const {id} = req.params
    if(!id)return sendMissingDependency(res, "id")
    const property = await Property.findById(id)
    if(!property) return sendResourceNotFound(res, "property")
    return res.status(200).json(property)
})

export const createProperty = catchAsync(async(req, res)=>{
    const {body: info} = req;
    const validated = validatePropertyInfo(info)
    console.log(validated)
    if(validated.error)return res.status(400).json({message:validated.error.message})
    const property = await Property.create(info)
    if(!property)return sendServerFailed(res, "create property")
    return res.status(201).json(property)
})