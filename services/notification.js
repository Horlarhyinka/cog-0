import Mailer from "./mailer.js";
import notification_types from "../util/notification_types.js";

export default class Notification{
    constructor(notificationType, email, Tel){
        this.notificationType = notificationType;
        this.services = [new Mailer(email),]
    }
    sendNotification = async(data) =>{
        if(!checkNotificationData(this.notificationType, data))return false;
            let successCount = 0;
        try {
            await Promise.all(this.services.forEach(async(service)=>{
                try {
                    service.sendNotification(this.notificationType, data)
                    successCount++
                } catch (error) {
                    console.log(error)
                }
            }))
        } catch (ex) {
            console.log({ex})
        }
            if(successCount < 1){
                return false;
            }
            return true
    }

}
    function checkNotificationData(type, data) {
        let status = false;

        switch(type){
            case notification_types.ONBOARDING_NOTIFICATION:
                const { url } = data;
                if(!url){
                    status = false;
                }
                break;
            case type === notification_types.NEW_OFFER:
                if(!data.property.location.landmark){
                    status = false;
                }else{
                    status =true
                }
                break;
            case notification_types.NEW_AGREEMENT:
                if(!data.property.location.landmark){
                    status = false;
                }else{
                    status =true
                }
                break;
        }
        return status
    }