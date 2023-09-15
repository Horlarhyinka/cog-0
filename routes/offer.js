import { Router } from "express";
import * as offer from "../controllers/offer.js";
import auth from "../middleware/authentication.js";
import validateObjectId from "../middleware/validateObjectId.js";
import restrictRouteTo from "../middleware/restrictRoute.js";
import roles from "../util/roles.js";

const router = Router()

router.use(auth)
router.get("/:offerId", validateObjectId, offer.getOffer)
router.get("/", offer.getOffers)
router.use(restrictRouteTo(roles.MANAGER))
router.post("/", offer.createOffer)
router.put("/:offerId", validateObjectId, offer.updateOffer)
router.delete("/:offerId", validateObjectId, offer.deleteOffer)

export default router;