import * as cloudinary from 'cloudinary'
import dotenv from "dotenv"
dotenv.config();


cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const cloudinaryUpload = async (file, folder) => { 
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            folder: folder,
            resource_type: "auto"
        })
    })
}


export {
    cloudinaryUpload
}