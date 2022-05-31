const aws = require("aws-sdk")
const { application } = require("express")
const res = require("express/lib/response")
const multer = require("multer")
const multerS3 = require("multer-s3")
const config = require("../config")

aws.config.update({
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    accessKeyId: config.AWS_PUBLIC_ACCESS_KEY,
    region: config.S3_REGION
})

const BUCKET = config.S3_BUCKET
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        bucket: BUCKET,
        s3: s3,
        acl: "public-read", //permission
        key: (req, file, cb) => {
            cb(null, Date.now()+file.originalname)
        }
    })
})

const uploadFile = (req,  res) => {
    console.log("UPLOAD FILE ", req.file)
    res.json({
    //    message: "successfully uploaded" ,
       data: req.file.key})
}

const getAllFiles = async (req,res) => {
    let response = await s3.listObjectsV2({ Bucket: BUCKET }).promise()
    let result = response.Contents.map(item => item.Key);
    res.send(result);
}

const downloadFile = async (req, res) => {
    const filename = req.params.filename
    let result = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise()
    res.send(result)
}

const deleteFile = (req, res) => {
    const filename = req.params.filename
    s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise()
    res.send("File deleted successfully")
}

module.exports = {
    upload,
    uploadFile,
    getAllFiles,
    downloadFile,
    deleteFile
}