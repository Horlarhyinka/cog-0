import * as unit from "../controllers/unit.js";
import {Router} from "express";
import authenticateUser from "../middleware/authentication.js"
import validateObjectId from "../middleware/validateObjectId.js";
import restrictRouteTo from "../middleware/restrictRoute.js";
import roles from "../util/roles.js";
const router = Router()

router.use(authenticateUser)
router.post("/:propertyId",restrictRouteTo(roles.MANAGER), validateObjectId, unit.createUnit);
router.put('/:id', restrictRouteTo(roles.MANAGER), validateObjectId, unit.updateUnit);
router.delete('/:id/:propertyId',restrictRouteTo(roles.MANAGER), validateObjectId, unit.deleteUnit);
router.get('/:id', unit.getSingleUnit);
router.get('/', unit.getAllUnit);




export default router
