import { sendInvalidEntry } from "../util/responseHandlers.js"
import { validateId } from "../util/validators.js"

export default (req, res, next) =>{
    for(let param in req.params){
        if(param.toLowerCase().endsWith("id")){
            const id = req.params[param]
            if(!validateId(id))return sendInvalidEntry(res, "id")
        }
    }
    return next()
}
