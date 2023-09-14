import { Router } from "express";
import * as agreement from "../controllers/agreement.js";
import auth from "../middleware/authentication.js";
import validateObjectId from "../middleware/validateObjectId.js";
import roles from "../util/roles.js";
import restrictRouteTo from "../middleware/restrictRoute.js";


const router = Router()

router.use(auth)
router.get("/:agreementId", validateObjectId, agreement.getAgreement)
router.get("/", agreement.getAgreements)
router.use(restrictRouteTo(roles.MANAGER))
router.post("/", agreement.createAgreement)
router.delete("/:agreementId", agreement.deleteAgreement)

export default router;