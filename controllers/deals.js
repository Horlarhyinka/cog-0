import Deal from "../models/deal.js";
import catchAsync from "../util/catchAsync.js";
import User from "../models/user.js";
import Manager from "../models/manager.js";
import roles from "../util/roles.js";
import { sendMissingDependency, sendResourceNotFound } from "../util/responseHandlers.js";
import Property from "../models/property.js";
import catchMongooseError from "../util/catchMongooseError.js";
import Mailer from "../services/mailer.js";
import notification_types from "../util/notification_types.js";
import { validateClient } from "../util/validators.js";

export const addProspect = catchAsync(async (req, res) => {
  let clientId = req.params.clientId || req.body.clientId || req.query.clientId;

  if (req.user.role === roles.CLIENT) {
    clientId = String(req.user._id);
  }

  const clientDoc = clientId ? await User.findById(clientId) : null;

  if (!clientDoc) {
    return sendResourceNotFound(res, "client");
  }

  const client = clientId
    ? { email: clientDoc.email, firstName: clientDoc.firstName, lastName: clientDoc.lastName }
    : { ...req.body };

  const validated = validateClient(client);

  if (validated.error) {
    return res.status(400).json({ message: `${validated.error.message}. Provide valid client info or clientId` });
  }

  const propertyId = req.query.property || req.query.propertyId || req.body.property || req.body.propertyId;

  if (!propertyId) {
    return sendMissingDependency(res, "property id");
  }

  const property = await Property.findById(propertyId);

  if (!property) {
    return res.status(403).json({ message: "property unavailable" });
  }

  const manager = await Manager.findById(property.manager);

  if (!manager || !manager.properties.includes(property._id)) {
    return res.status(403).json({ message: "property unavailable" });
  }

  try {
    const deal = await Deal.create({
      ...req.body,
      client,
      property: property._id,
      price: property.price,
    });

    if (clientId) {
      await User.findByIdAndUpdate(clientId, { $push: { deals: deal._id } });
    }

    manager.deals.push(deal._id);
    await manager.save();

    const managerMailer = new Mailer(manager.email);
    const clientMailer = new Mailer(client.email);
    const url = `${req.hostname}/deals/${deal._id}`;
    const landmark = (await deal.populate("property")).property?.location?.landmark;

    await Promise.all([
      managerMailer.sendNotification(notification_types.NEW_PROSPECT, { url, landmark }),
      clientMailer.sendNotification(notification_types.APPLICATION_SENT, { url, landmark }),
    ]);

    return res.status(201).json(deal);
  } catch (ex) {
    console.error(ex);
    const mongooseErrorMessage = catchMongooseError(ex);

    if (mongooseErrorMessage) {
      return res.status(401).json(mongooseErrorMessage);
    }

    throw ex;
  }
});


export const getDeals = catchAsync(async(req, res)=>{
  const {deals} = await req.user.populate("deals")
  return res.status(200).json(deals)
})

export const getDeal = catchAsync(async(req, res)=>{
  const {dealId} = req.params
  if(!dealId)return sendMissingDependency(res, "dealId")
    const deal = (await req.user.populate("deals")).deals.find(d=>String(d._id)===String(dealId))
    !deal?
    sendResourceNotFound(res, "deal"): 
    res.status(200).json(deal)
})

export const updateDeal = catchAsync(async(req, res)=>{
  const {dealId} = req.params
  try{
 if(!dealId)return sendMissingDependency(res, "dealId")
  const {deals} = await req.user.populate("deals")
  const target = deals.find(d=>String(d._id)===String(dealId))
    const mutables = ["stage", "note"]
    if(!target)return sendResourceNotFound(res, "deal")
    for(let key of mutables){
      if(req.body[key]){
      target.set(key, req.body[key])
      }
    }
    return res.status(200).json(await target.save())
  }catch(ex){
    const mongooseErrorMessage = catchMongooseError(ex);
    if (mongooseErrorMessage)return res.status(401).json(mongooseErrorMessage);
    throw ex;
  }
})

export const deleteDeal = catchAsync(async(req, res)=>{
  const {deals} = await req.user.populate("deals")
  const target = deals.find(d=>String(d._id)===String(req.params.dealId))
  if(!target)return sendResourceNotFound(res, "deal")
  await target.delete()
  return res.status(204).json({message: "success"})
})