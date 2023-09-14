import {Router} from "express";
import * as deal from "../controllers/deals.js";
import authenticateUser from "../middleware/authentication.js";
import restrictRouteTo from "../middleware/restrictRoute.js";
import validateObjectId from "../middleware/validateObjectId.js";
import roles from "../util/roles.js";

const router = Router()

router.use(authenticateUser)

router.get("/:dealId", validateObjectId, deal.getDeal)
router.post("/", deal.addProspect)
router.get("/", deal.getDeals)
router.use(restrictRouteTo(roles.MANAGER))
router.put("/:dealId", validateObjectId,deal.updateDeal)
router.delete("/:dealId", validateObjectId, deal.deleteDeal)

export default router;