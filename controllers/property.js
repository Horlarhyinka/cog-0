import Property from "../models/property.js";
import catchAsync from "../util/catchAsync.js";
import { paginate } from "../util/funcs.js";
import { sendInvalidEntry, sendMissingDependency, sendResourceNotFound, sendServerFailed } from "../util/responseHandlers.js";
import { validatePropertyInfo } from "../util/validators.js";
import { exToMssg, handleMongooseErrors } from "../util/err.js";


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

export const createProperty = catchAsync(async(req, res, next)=>{
    const {body: data} = req;
    const validated = validatePropertyInfo(data)
    if(validated.error)return res.status(400).json({message:validated.error.message})
    try{
    const property = await Property.create({...data, manager: req.user._id})
    //await update user
    const user = req.user;
    user.properties = [...user.properties, property._id]
    await user.save()
    if(!property)return sendServerFailed(res, "create property")
    return res.status(201).json(property)
    }catch(ex){
        const errMessages = handleMongooseErrors(ex)
        if(errMessages.message)return res.status(400).json(errMessages)
        return sendServerFailed(res, "add property")
    }
})

export const deleteProperty = catchAsync(async(req, res)=>{
    const {id} = req.params || req.query;
    try{
        await Property.findByIdAndDelete(id)
        return res.status(204).json({message: " property deleted"})
    }catch(ex){
        const errMessages = handleMongooseErrors(ex)
        if(errMessages.message)return res.status(400).json(errMessages)
        return sendServerFailed(res, "delete property")
    }
})

export const updateStatus = catchAsync(async(req, res)=>{
    const isFeatured = req.query?.isFeatured || req.body?.isFeatured;
    const available = req.query?.available || req.body?.available;
    const {id} = req.params;
    if(!id)return sendMissingDependency(res, "product id")
    const property = await Property.findById(id)
    if(!property)return sendResourceNotFound(res, "property")
    if(String(isFeatured)?.toLowerCase() !== "false"){
        property.set("isFeatured", true)
    }else{
        property.set("isFeatured", false)
    }
    if(String(available)?.toLowerCase() !== "false"){
        property.set("available", true)
    }else{
        property.set("available", false)
    }
    try{
        const updated = await property.save()
        return res.status(200).json(updated)
    }catch(ex){
        const errMessages = handleMongooseErrors(ex)
        if(errMessages.message)return res.status(400).json(errMessages)
        return sendServerFailed(res, "delete property")
    }

})

export const updateProperty = catchAsync(async(req, res)=>{
    const {id} = req.params || req.query;
    if(!id)return sendMissingDependency(res, "property id")
    const property = await Property.findById(id)
    if(!property)return sendResourceNotFound(res, "property")
    const mutables = ["type", "address", "price", "images"]
    const images = req.body.images
    if(images && !Array.isArray(images)){
        delete req.body.images
    }
    for(let key in req.body){
        if(mutables.includes(key)){
            property.set(key, req.body[key])
        }
    }
    try {
        const updated = await property.save()
        return res.status(200).json(updated)
    } catch (ex) {
        const errMessages = handleMongooseErrors(ex)
        if(errMessages.message)return res.status(400).json(errMessages)
        console.log(errMessages)
        return sendServerFailed(res, "update property")
    }
})

export const updateLocation = catchAsync(async(req, res)=>{
    const {id} = req.params || req.query;
    if(!id)return sendMissingDependency(res, "property id")
    const property = await Property.findById(id)
    if(!property)return sendMissingDependency(res, "property")
    const mutables = ["state", "lga", "zip", "landmark"]
        for(let key in req.body){
        if(mutables.includes(key)){
            property.location[key] = req.body[key]
        }
    }
    const updated = await property.save()
    return res.status(200).json(updated)
})

// Property.deleteMany({}).then(()=>console.log("done deleting"))

/**
 * {
  "type": "BUNGALOW",
  "location":{
    "state": "Lagos",
    "lga": "island",
    "landmark": "epe"
  },
  "price":345000,
  "address": "owo road, epe, Lagos Island"
}
 */