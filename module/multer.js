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

const fileFilter = (req, file, callback) => {
    const imgType = file.mimetype.split('/')[1]

    if (imgType == 'jpg' || imgType == 'png' || imgType == 'jpeg') {
        callback(null, true)
    } else {
        callback(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {   // 이미지 크기, 개수 제한 
        fileSize: 5 * 1024 * 1024,  // 5mb로 제한
        files: 5
    }

})

module.exports = upload