import Offer from "../models/offer.js"
import catchAsync from "../util/catchAsync.js";
import Deal from "../models/deal.js";
import * as responseHandlers from "../util/responseHandlers.js"
import catchMongooseEx from "../util/catchMongooseError.js"
import stages from "../util/stages.js";
import notification_types from '../util/notification_types.js';
import Mailer from "../services/mailer.js";
import Notification from "../services/notification.js"
import roles from "../util/roles.js";


export const createOffer = catchAsync(async(req, res)=>{
    const {price, note, dealId, propertyId} = req.body
        let deal;
        if(!propertyId)return responseHandlers.sendMissingDependency(res, "propertyId")
        if(dealId){
            deal = await Deal.findById(dealId)
            if(!deal)return responseHandlers.sendResourceNotFound(res, "deal")
        }
        const {properties} = await req.user.populate("properties")
        const property = properties.find(prop=>String(prop._id) === String(propertyId))
        if(!property)return responseHandlers.sendResourceNotFound(res, "property")
        try{
            const newOffer = await (await Offer.create({deal: deal?._id, price, property: propertyId, note})).populate("property")
            const user = req.user
            user.offers.push(newOffer._id)
            if(deal){
                deal.stage = stages.OFFER
                deal.offer = newOffer._id
                await deal.save()
            }
            await user.save()
            const managerNotification = new Notification(notification_types.NEW_OFFER, user.email)
            await managerNotification.sendNotification({property})

            if(deal){
            const clientNotification = new Notification(notification_types.NEW_OFFER, deal.client.email)
            await clientNotification.sendNotification({property})
            }
            return res.status(201).json({message: "successful", data: newOffer})
        }catch(ex){
            const errMessage = catchMongooseEx(ex)
            if(errMessage?.message)return res.status(400).json(errMessage)
            return responseHandlers.sendServerFailed(res, "create offer")
        }
})

export const deleteOffer = catchAsync(async(req, res)=>{
    const offerId = req.params.offerId
    if(!offerId)return responseHandlers.sendMissingDependency(res, "offerId")
    const {offers} = await req.user.populate("offers")
    const offer = offers.find(offerObj => String(offerObj._id) === String(offerId))
    if(!offer)return responseHandlers.sendResourceNotFound(res, "offer")
    try{
        await offer.delete()
        return res.status(204).json({message: "successful"})
    }catch(ex){
        const errMessage = catchMongooseEx(ex)
        if(errMessage.message)return res.status(400).json(errMessage)
        return responseHandlers.sendServerFailed(res, "delete offer")
    }
})  

export const updateOffer = catchAsync(async(req, res)=>{
    const mutables = ["note", "price"]
    const {offerId} = req.params
    if(!offerId)return responseHandlers.sendMissingDependency(res, "offerId")
    const {offers} = await req.user.populate("offers")
    const target = offers.find(offerObjectObj => String(offerObjectObj._id) === String(offerId))
    if(!target)return responseHandlers.sendResourceNotFound(res, "offer")
    try {
    for(let key of mutables){
        if(req.body[key]){
            target.set(key, req.body[key])
        }
    }
    const updated = await target.save()
    return res.status(200).json({message: "successful", data: updated})
    } catch (ex) {
        const errMessage = catchMongooseEx(ex)
        if(errMessage?.message)return res.status(400).json(errMessage)
        console.log(ex)
        return responseHandlers.sendServerFailed(res, "update offer")
    }
    
})

export const getOffers = catchAsync(async(req, res)=>{
    let result;
    switch(req.user.role){
        case roles.CLIENT:
            result = (await req.user.populate({
                path: "deals",
                populate: "offer"
            })).deals
            .map(deal=>deal.offer && deal.offer)
        break;
        case roles.MANAGER:
            result = (await req.user.populate("offers")).offers
        break;
        default:
            result = [];
        break;
    }
    return res.status(200).json({message: "successful", data: result})
})

export const getOffer = catchAsync(async(req, res)=>{
    let result;
            const {offerId} = req.params
    if(!offerId)return sendMissingDependency(res, "agreementId")
    switch(req.user.role){
        case roles.MANAGER:
            const {offers} = await req.user.populate("offers")
            result = offers.find(ofr=>String(ofr._id)===String(offerId))
        break;
        case roles.CLIENT:
            const cloffer = result = (await req.user.populate({
                path: "deals",
                populate: "offer"
            })).deals
            .map(deal=>deal.offer?._id && deal.offer)
            result = cloffer.find(ofr=>String(ofr._id)===String(offerId))
    }
    
    if(!result)return sendResourceNotFound(res)
    return res.status(200).json(result)
})

