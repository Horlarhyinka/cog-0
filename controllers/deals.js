import Deal from "../models/deal.js";
import catchAsync from "../util/catchAsync.js";
import User from "../models/user.js";
import Manager from "../models/manager.js"
import roles from "../util/roles.js";
import { sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers.js";
import Property from "../models/property.js";
import catchMongooseError from "../util/catchMongooseError.js";
import Mailer from "../services/mailer.js";
import notification_types from "../util/notification_types.js";
import { validateClient } from "../util/validators.js";

export const addProspect = catchAsync(async(req, res)=>{
    let client;
    let clientId = req.params.clientId || req.body.clientId || req.query.clientId
    if(req.user.role = roles.CLIENT){
        clientId = String(req.user._id)
    }
    if(clientId){
        const clientDoc = await User.findById(clientId)
        if(!clientDoc)sendResourceNotFound(res, "client")
        const {email, firstName, lastName, tel, address} = clientDoc;
        client = {email, firstName, tel, address, lastName}
    }else{
        const {email, firstName, lastName, tel, address} = req.body;
        client = {email, firstName, lastName, tel, address}
    }
    if(!client)return sendMissingDependency(res, "client info or clientId")
    const validated = validateClient(client)
    if(validated.error)return res.status(400).json({message: validated.error.message + ". Provide valid client info or clientId"})
    const propertyId = req.query.property || req.query.propertyId || req.body.property || req.body.propertyId
    if(!propertyId)return sendMissingDependency(res, "property id")
    const property = await Property.findById(propertyId)
    const manager = await Manager.findById(property.manager)
    if(!manager)return res.status(403).json({message: "property unavailable"})
    const indx = manager.properties.findIndex(p=>String(p) == String(property._id))
    if(indx < 0)return res.status(403).json({message: "property unavailable"})
    try{
        const deal = await Deal.create({client, property: property._id, price: property.price, description: property.description})
        //update client deals
        if(clientId){  await User.findByIdAndUpdate(clientId, {$push:{ deals: deal._id}}) }
        //update manager deals
        manager.properties.push(deal._id)
        await manager.save()
        const managerMailer = new Mailer(manager.email)
        const clientMailer = new Mailer(client.email)
        const url = `${req.hostname}/deals/${deal._id}`
        const landmark = (await deal.populate("property"))?.property?.location?.landmark
        await managerMailer.sendNotification(notification_types.NEW_PROSPECT, {url, landmark})
        await clientMailer.sendNotification(notification_types.APPLICATION_SENT, {url, landmark})
        return res.status(201).json(deal)
    }catch(ex){
        console.log(ex)
        const mongooseErrorMessage = catchMongooseError(ex)
        if(mongooseErrorMessage)return res.status(401).json(mongooseErrorMessage)
        throw Error(ex)
    }
})