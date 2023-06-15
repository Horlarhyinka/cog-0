import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
})

const uplaod = multer({ storage })


export {
    uplaod
}