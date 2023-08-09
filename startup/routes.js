
import propertyRoutes from "../routes/property.js"
import authRouter from "../routes/auth.js";
import unitRouter from "../routes/unit.js"
export default (app) =>{
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/unit', unitRouter);
    app.use("/api/v1/properties", propertyRoutes)
    app.use((req, res)=>res.status(404).json({message: "route not found"}))
}