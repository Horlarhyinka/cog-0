import Offer from "../models/offer.js"
import catchAsync from "../util/catchAsync.js";
import Deal from "../models/deal.js";
import * as responseHandlers from "../util/responseHandlers.js"
import catchMongooseEx from "../util/catchMongooseError.js"
import statuses from "../util/statuses.js";

export const createOffer = catchAsync(async(req, res)=>{
    const {price, note, dealId, propertyId} = req.body
        let deal;
        if(dealId){
            deal = await Deal.findById(dealId)
            if(!deal)return responseHandlers.sendResourceNotFound(res, "deal")
        }
        try{
            const newOffer = await (await Offer.create({deal: deal?._id, price, property: propertyId, note})).populate("property")
            const user = req.user
            user.offers.push(newOffer._id)
            if(deal){
                deal.status = statuses.OFFER
                await deal.save()
            }
            await user.save()
        }catch(ex){
            const errMessage = catchMongooseEx(ex)
            if(errMessage.message)return responseHandlers.sendInvalidEntry(res, {message: errMessage.message})
            return responseHandlers.sendServerFailed(res, "create offer")
        }
})

export const deleteOffer = catchAsync(async(req, res)=>{
    const {offerId} = req.params
})

export const updateOffer = catchAsync(async(req, res)=>{
    
})

export const getOffers = catchAsync(async(req, res)=>{
    
})

export const getOffer = catchAsync(async(req, res)=>{
    
})

