import Agreement from "../models/agreement.js";
import catchAsync from "../util/catchAsync.js";
import {sendInvalidEntry, sendMissingDependency, sendResourceNotFound, sendServerFailed} from '../util/responseHandlers.js';
import { validateClient } from "../util/validators.js";
import Notification from "../services/notification.js";
import notification_types from "../util/notification_types.js";
import catchMongooseEx from "../util/catchMongooseError.js"
import stages from "../util/stages.js";
import roles from "../util/roles.js";

export const createAgreement = catchAsync(async(req, res)=>{
    const {price, email, firstName, lastname,  propertyId} = req.body;
    const dealId = req.params.dealId || req.query.dealId || req.body.dealId
    let client;
    let property;
    let deal;
    if(!price)return sendMissingDependency(res, "price")
    const user = await req.user.populate(["deals", "properties"])
    if(dealId){
        deal = user.deals.find(d=>String(d._id)===String(dealId))
        if(!deal)return sendResourceNotFound(res, "deal")
        const populated = await deal.populate("property")
        property = populated.property
        const {email, firstName, lastName} = deal.client
        client = {email, firstName, lastName}

    }else{
        client = {email, firstName, lastname}
        if(!propertyId)return sendMissingDependency(res, "propertyId")
        const targetProp = user.properties.find(p=>String(p._id)=== String(propertyId))
        if(!targetProp)return sendResourceNotFound(res, "property")
        property = targetProp
    }
    //clean client object
    Object.keys(client).forEach(k=>!client[k] && delete client[k])
    const validatecl = validateClient(client)
    if(validatecl.error)return sendInvalidEntry(res, validatecl.error.message)
        try{
            const newAgreement = await Agreement.create({...req.body, client, payment:{amount: price}, property: property._id})
            user.agreements.push(newAgreement._id)
            await user.save()
            if(deal){
            deal.agreement = newAgreement._id
            deal.stage = stages.AGREEMENT
            await deal.save()
            }
            const managerNotification = new Notification(notification_types.NEW_AGREEMENT, email)
            const clientNotification = new Notification(notification_types.NEW_AGREEMENT, client.email)
            await Promise.all([managerNotification.sendNotification({property}), 
                clientNotification.sendNotification({property})])
            return res.status(201).json(newAgreement)
        }catch(ex){
            const errMessage = catchMongooseEx(ex)
            if(errMessage?.message)return res.status(400).json(errMessage)
            return sendServerFailed(res, "create agreement")
        }
})

export const deleteAgreement = catchAsync(async(req, res)=>{
    const {agreementId} = req.params
    if(!agreementId)return sendMissingDependency(res, "agreementId")
    const {agreements} = await req.user.populate("agreements")
    const target = agreements.find(agr=>String(agr._id)===String(agreementId))
    if(!target)return sendResourceNotFound(res)
    await target.delete()
    return res.status(204).json({message: "successful"})
})

export const getAgreement = catchAsync(async(req, res)=>{
    let result;
            const {agreementId} = req.params
    if(!agreementId)return sendMissingDependency(res, "agreementId")
    switch(req.user.role){
        case roles.MANAGER:
            const {agreements} = await req.user.populate("agreements")
            result = agreements.find(agr=>String(agr._id)===String(agreementId))
        break;
        case roles.CLIENT:
            const clagreements = result = (await req.user.populate({
                path: "deals",
                populate: "agreement"
            })).deals
            .map(deal=>deal.agreement?._id && deal.agreement)
            result = clagreements.find(agr=>String(agr._id)===String(agreementId))
    }
    
    if(!result)return sendResourceNotFound(res)
    return res.status(200).json(result)
})

export const getAgreements = catchAsync(async(req, res)=>{
    let result;
    switch(req.user.role){
        case roles.CLIENT:
            result = (await req.user.populate({
                path: "deals",
                populate: "agreement"
            })).deals
            .map(deal=>deal.agreement?._id && deal.agreement)
        break;
        case roles.MANAGER:
            result = (await req.user.populate("agreements")).agreements
        break;
        default:
            result = [];
        break;
    }
    return res.status(200).json(result)
})