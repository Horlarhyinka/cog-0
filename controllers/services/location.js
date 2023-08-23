import catchAsyncErrors from "../../util/catchAsync.js";
import locations from "../../public/locations.json" assert {type: "json"}
import { sendMissingDependency } from "../../util/responseHandlers.js";

export const getStates = catchAsyncErrors(async(req, res)=>{
    let states;
    if(req.query.extended || req.body.extended){
        states = locations
    }else{
        states = Object.keys(locations)
    }
    if(!states)return res.status(502).json({message: "service unavailable"})
    return res.status(200).json(states)
})

export const getTowns = catchAsyncErrors(async(req, res)=>{
    const state = (req.params.state || req.query.state || req.body.state)?.toLowerCase()
    if(!state || !locations[state])return sendMissingDependency(res, "a valid state")
    return res.status(200).json(locations[state]["towns"])
})

export const getLgas = catchAsyncErrors((req, res)=>{
    const state = (req.params.state || req.query.state || req.body.state)?.toLowerCase()
    if(!state || !locations[state])return sendMissingDependency(res, "a valid state")
    return res.status(200).json(locations[state]["lgas"])
})