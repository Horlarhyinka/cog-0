import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import connectDB from "./config/db.js";
import propertyRoutes from "./routes/property.js"
import authRouter from "./routes/auth.js";

dotenv.config();
const app = express();

const {JWT_SECRET, NODE_ENV, PORT} = process.env;


const port = Number(PORT)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cookieParser(JWT_SECRET));
app.use(bodyParser.json());
// routes middleware
app.use('/api/v1/auth', authRouter);
app.use("/api/v1/properties", propertyRoutes)



mongoose.set('strictQuery', true);


if (NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}


async function start(){
  try{

await connectDB()
console.log("connected to db")
app.listen(port,()=>{
  console.log(`server running ${NODE_ENV} mode on port ${port}`)
})
  }catch(ex){
    console.log("server failed to start: ",ex)
  }

}
start()