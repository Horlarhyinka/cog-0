import { StatusCodes } from "http-status-codes";

export default (req, res, next) =>{
    if(req.user?.kind !== "admin")return res.status(StatusCodes.UNAUTHORIZED).json({message: "UNAUTHORIZED"})
    next()
}