import Unit from "../models/unit.js";
import property from "../models/property.js";
import { sendResourceNotFound, sendServerFailed } from "../util/responseHandlers.js";
import { handleMongooseErrors } from "../util/err.js";


const createUnit = async(req, res) => {
    const newUnit = new Unit(req.body)

    try{
        const savedUnit = await newUnit.save()

        const propertyId = req.params.propertyId;

        const properties = await property.findById(propertyId)

        if(!properties) return sendResourceNotFound(res, "property")


        await property.findByIdAndUpdate(propertyId, 
            {$push: {units: savedUnit._id}},
            {new: true}
        )

        return res.status(201).json({ message: "A unit apartment has been created!", data: savedUnit});

    }catch(ex){
        const errMessages = handleMongooseErrors(ex)
        if(errMessages.message)return res.status(400).json(errMessages)
        return sendServerFailed(res, "create a unit for property")
    }
}


const updateUnit = async (req, res, next) => {
    try {

        const updatedUnit = await Unit.findByIdAndUpdate(req.params.id,
            { $set: req.body }, { new: true }
        )

        if(!updatedUnit) return sendResourceNotFound(res, "unit")

        return res.status(200).json({ message: "update successful", data: updatedUnit});
    } catch (err) {
       return next(err)
    }
}

const deleteUnit = async (req, res, next) => {

    const unitId = req.params.unitid
    
    try {
        await Unit.findByIdAndDelete(req.params.id);

        await property.findByIdAndUpdate(unitId, { $pull: { units: req.params.id } }, { new: true })

        return res.status(200).json({ message: "Unit deleted successfully" });
        
        } catch (err) {
            return next(err)
        }
    } 

    const getSingleUnit = async (req, res, next) => {
        try {
            const singleUnit = await Unit.findById(req.params.id)
    
            return res.status(200).json({ message: "Success!!", data: singleUnit});
        } catch (err) {
            return next(err)
        }
    }
    
    const getAllUnit = async (req, res) => {
        try {

            const propertyId = req.params.propertyId;
            
            const allUnit = await Unit.find({ where: {
                propertyId: propertyId
            }})
    
            res.status(200).json({ message: "Success!!", data: allUnit.reverse()})
        } catch (err) {
            return next(err)
        }
    }

export {
    createUnit,
    updateUnit,
    deleteUnit,
    getSingleUnit,
    getAllUnit
}