import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs"
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const {MAIL_HOST, MAIL_PASSWORD, MAIL_USER, MAIL_PORT, MAIL_SERVICE} = process.env

class Mailer{
    constructor(reciever){
        const transport = nodemailer.createTransport({
                    host: MAIL_HOST,
                    port: MAIL_PORT,
                    service: MAIL_SERVICE,
                    auth:{
                        user: MAIL_USER,
                        pass: MAIL_PASSWORD
                    }
                })
        const mailOptions ={
            from: MAIL_USER,
            to: reciever
        }
        this.sendMail = async function(name, options){
        if(!reciever || !name)throw Error("provide and mail type recipient email")
        try{
            const fileDir = path.resolve(__dirname, "../views/"+name+".ejs")
            mailOptions.html = await ejs.renderFile(fileDir, options)
        }catch(ex){
            throw ex
        }
        return transport.sendMail(mailOptions)
    }
    }

    sendPasswordResetMail = (url) => this.sendMail("password-reset", {url})
    sendNotification = (type, data) => this.sendMail(type, data)
   
}

export default Mailer;

