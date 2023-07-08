import * as property from "../controllers/property.js";
import {Router} from "express";
import authenticateUser from "../middleware/authentication.js"
import validateObjectId from "../middleware/validateObjectId.js";
import restrictRouteTo from "../middleware/restrictRoute.js";
import roles from "../util/roles.js";
const router = Router()
router.get("/", property.getProperties)
router.get("/:id", validateObjectId, property.getProperty)
router.use(authenticateUser)
router.post("/", restrictRouteTo(roles.MANAGER), property.createProperty)
router.delete("/:id", restrictRouteTo(roles.MANAGER), validateObjectId, property.deleteProperty)
router.put("/:id", restrictRouteTo(roles.MANAGER), validateObjectId, property.updateProperty)
router.put("/:id/status", restrictRouteTo(roles.MANAGER), validateObjectId, property.updateStatus)


export default router