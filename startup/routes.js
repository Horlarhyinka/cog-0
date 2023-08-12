
import propertyRoutes from "../routes/property.js"
import authRouter from "../routes/auth.js";
import locationServiceRouter from "../routes/services/location.js"
export default (app) =>{
    app.use('/api/v1/auth', authRouter);
    app.use("/api/v1/properties", propertyRoutes)
    app.use("/api/v1/services/locations", locationServiceRouter)
    app.use((req, res)=>res.status(404).json({message: "route not found"}))
}