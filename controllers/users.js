import User  from "../models/users.js";
import catchAsync from "../util/catchAsync.js";
import { trimUser } from "../util/funcs.js";
import { sendMissingDependency, sendServerFailed } from "../util/responseHandlers.js";


const get_single_user = async (req, res, next) => {
    try {
        const singleuser = await User.findById(req.params.id)
        res.status(200).json(singleuser)
    } catch (err) {
        return next(err);
    }
}

const get_all_users = async (req, res) => {
    try {
        const allusers = await User.find()
        res.status(200).json(allusers.reverse())
    } catch (error) {
        res.status(500).json(err)
    }
}

const update_user = async (req, res, next) => {
    if ( req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.JWT_SECRET).toString();
        }
        try {
            const updateduser = await User.findByIdAndUpdate(req.params.id,
                { $set: req.body }, { new: true });
                return res.status(201).json({
                    message: "update successful",
                    user: updateduser,
                });
        }catch (err) {
            return next(err);
        }
    } else {
        res.status(403).json( "You are not authorized!")
    }
}


export const deleteUser = async (req, res) => {
    const id = req.query?.id || req.body?.id || req.params?.id
    if(!id)return sendMissingDependency(res, "user id")
    try{
        await User.findByIdAndDelete(id)
        return res.status(204).json({message: "user deleted"})
    }catch(ex){
        return sendServerFailed(res, "delete user")
    }
}

export const getProfile = catchAsync(async(req, res)=>{
    let {id} = req.user;
    if(!id){
       id = req.user?._id 
    }
    if(!id)return sendMissingDependency(res, "user id")
    const user = await User.findById(id)
    return res.status(200).json(trimUser(user))
})

export const updateProfile = catchAsync(async(req, res)=>{
    const mutables = ["firstName", "lastName", "tel", "avatar", "address"];
    const user = req.user;
    for(let key in req.body){
        if(mutables.includes(key)){
            user.set(key, req.body[key])
        }
    }
    const updated = await user.save()
    return res.status(200).json(updated)
})

export {
    update_user,
    get_all_users,
    get_single_user
}