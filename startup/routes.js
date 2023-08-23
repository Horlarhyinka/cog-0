
import propertyRoutes from "../routes/property.js"
import authRouter from "../routes/auth.js";
import unitRouter from "../routes/unit.js"
import locationServiceRouter from "../routes/services/location.js"
import dealsRouter from "../routes/deal.js";
import userRouter from "../routes/user.js" 

export default (app) =>{
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/units', unitRouter);
    app.use("/api/v1/properties", propertyRoutes)
    app.use("/api/v1/services/locations", locationServiceRouter)
    app.use("/api/v1/deals", dealsRouter)
    app.use("/api/v1/profile", userRouter)
    app.use((req, res)=>res.status(404).json({message: "route not found"}))
}