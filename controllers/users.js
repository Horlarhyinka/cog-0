import User  from "../models/users.js"
import CryptoJS from "crypto-js"


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


const delete_user = async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Deleted successfully!");
        }catch (err) {
            res.status(500).json(err)
        } 
    } 
}

export {
    update_user,
    delete_user,
    get_all_users,
    get_single_user
}