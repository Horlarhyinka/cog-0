import roles from "./roles.js";
import user from "../models/user.js";
import manager from "../models/manager.js";

export default (role)=>{
    role = role?.toUpperCase();
    let model;
    switch(role){
        case roles.CLIENT:
            model = user;
            break;
        case roles.MANAGER:
            model = manager;
            break;
        default:
            model = user;
    }
    return model; 
}