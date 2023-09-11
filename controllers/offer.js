import Offer from "../models/offer.js"
import catchAsync from "../util/catchAsync.js";
import Deal from "../models/deal.js";
import * as responseHandlers from "../util/responseHandlers.js"
import catchMongooseEx from "../util/catchMongooseError.js"
import statuses from "../util/stages.js";

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
            if(errMessage.message)return res.status(400).json(errMessage)
            return responseHandlers.sendServerFailed(res, "create offer")
        }
})

export const deleteOffer = catchAsync(async(req, res)=>{
    const offerId = req.params.offerId
    if(!offerId)return responseHandlers.sendMissingDependency(res, "offerId")
    try{
        await Offer.findByIdAndDelete(offerId)
        return res.status(204).json({message: "successful"})
    }catch(ex){
        const errMessage = catchMongooseEx(ex)
        if(errMessage.message)return res.status(400).json(errMessage)
        return responseHandlers.sendServerFailed(res, "delete offer")
    }
})

export const updateOffer = catchAsync(async(req, res)=>{
    
})

export const getOffers = catchAsync(async(req, res)=>{
    
})

export const getOffer = catchAsync(async(req, res)=>{
    
})

