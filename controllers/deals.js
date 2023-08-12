import Deal from "../models/deal.js";
import catchAsync from "../util/catchAsync.js";
import User from "../models/user.js"
import roles from "../util/roles.js";
import { sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers.js";
import Property from "../models/property.js";
import catchMongooseError from "../util/catchMongooseError.js";
import Mailer from "../services/mailer.js";
import notification_types from "../util/notification_types.js";

export const addProspect = catchAsync(async(req, res)=>{
    let client;
    const clientId = req.params.clientId || req.body.clientId || req.query.clientId
    const clientDoc = await User.findOne({_id: clientId, role: roles.CLIENT})
    if(clientDoc){
        const {email, firstName, lastName, tel, address} = client;
        client = {email, firstName, tel, address, lastName}
    }else{
        const {email, firstName, lastName, tel, address} = req.body;
        client = {email, firstName, lastName, tel, address}
    }
    if(!client)return sendMissingDependency(res, "client info or clientId")
    const propertyId = req.query.property || req.query.propertyId || req.body.property || req.body.propertyId
    if(!propertyId)return sendMissingDependency(res, "property id")
    const propertyIndex = req.user?.properties.findIndex((prop)=>String(prop) == String(propertyId))
    if(propertyIndex < 0)return sendResourceNotFound(res, "property")
    const property = await Property.findById(propertyId)
    const {price, description} = property

    //<<<<<<<<
//awaiting units api implementation
    //>>>>>>>

    //online application implementation is left out here
    try{
        const deal = await Deal.create({client, property: propertyId, price, description})
        const managerMailer = new Mailer(req.user?.email)
        const clientMailer = new Mailer(client.email)
        const url = `${req.host}/deals/${deal._id}`
        const landmark = (await deal.populate("property"))?.property?.location?.landmark
        await managerMailer.sendNotification(notification_types.NEW_PROSPECT, {url, landmark})
        await clientMailer.sendNotification(notification_types.APPLICATION_SENT, {url, landmark})
        return res.status(201).json(deal)
    }catch(ex){
        const mongooseErrorMessage = catchMongooseError(ex)
        if(mongooseErrorMessage)return res.status(401).json({message: mongooseErrorMessage})
        throw Error(ex)
    }
})