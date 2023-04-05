
require('dotenv').config();
const s3Obj = require('aws-sdk/clients/s3')
const fs = require('fs')



const uploadFolder = require('../../static_vars/upload_folder_dict')

const s3 = new s3Obj({
    region: process.env.AWS_BUCKET_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
})


function uploadFile(filename, filepath, foldername) {
    const fileStream = fs.createReadStream(filepath)
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: foldername + "/" + filename

    }

    return s3.upload(uploadParams).promise()
}

function getFileStream(foldername, filename) {
    const downloadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: foldername + "/" + filename

    }

    return s3.getObject(downloadParams).createReadStream()
}


function checkFileExist(foldername, filename) {

    const downloadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: foldername + "/" + filename

    }
    return s3.headObject(downloadParams).promise()

}

module.exports = { uploadFile, uploadFolder, getFileStream, checkFileExist }