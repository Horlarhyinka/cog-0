import Mailer from "./mailer";
import notification_types from "../util/notification_types";

export default class Notification{
    constructor(notificationType, email, Tel){
        this.notificationType = notificationType;
        this.services = [new Mailer(email),]
    }
    sendNotification = async(data) =>{
        if(!checkNotificationData(type, data))return;
            let successCount = 0;
        try {
            await Promise.all(this.services.forEach(async(service)=>{
                try {
                    service.sendNotification(type, )
                } catch (error) {
                    throw Error(error)
                }
            }))
        } catch (ex) {
            if(successCount < 1){
                return false;
            }
            console.log(ex)
            return true
        }
    }

}
    function checkNotificationData(type, data) {
        const status = true;
        switch(type){
            case notification_types.ONBOARDING_NOTIFICATION:
                const { url } = data;
                if(!url){
                    status = false;
                }
                break;
            
        }
    }