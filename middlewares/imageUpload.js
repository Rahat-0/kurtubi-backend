const multer = require('multer')

const filePath = './public/images'

const store = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, filePath)
    },
    filename(req, file, cb) {
        let origin = file.originalname
        let rendom = Date.now()
        cb(null, rendom + origin)
    }
})

const imageUplaod = multer({
    storage: store,
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(new Error("file format error!"));
        }
    }
})

module.exports = imageUplaod;