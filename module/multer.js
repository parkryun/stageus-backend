const multer = require('multer')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')
const s3Option = require('../config/s3')
const moment = require("moment")

const s3 = new aws.S3(s3Option)

const storage = multerS3({
    s3: s3,
    acl:'public-read',
    bucket: "stageus-ryun",
    contentType: multerS3.AUTO_CONTENT_TYPE, 
    key: (req, file, callback) => {
        let datetime = moment().format('YYYYMMDDHHmmss')
        callback(null, `${datetime}_${file.originalname}`)
    }
})

const upload = multer({storage: storage})

module.exports = upload