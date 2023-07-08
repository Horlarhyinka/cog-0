import { sendUnauthenticated } from "../util/responseHandlers.js";
import roles from "../util/roles.js";

export default (role) =>{
    return (req, res, next) =>{
        const user = req.user;
        if(!user)return sendUnauthenticated(res);
        const userRole = user.role?.toUpperCase();
        if(!userRole || !roles[userRole])return res.status(400).json({message:"invalid user role"});
        if(userRole !== role?.toUpperCase())return res.status(403).json({message: "you are not cleared for this action"});
        return next()
    }
}