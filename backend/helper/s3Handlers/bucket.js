
require('dotenv').config();
const s3Obj = require('aws-sdk/clients/s3')
const signedUrlExpireSeconds = 60 * 5
const s3 = new s3Obj({
    region: process.env.AWS_BUCKET_REGION,
    bucketName: process.env.AWS_BUCKET_NAME,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    },
    signatureVersion: 'v4'
})

module.exports = {
    getFileMeta: async (foldername, filename) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename,
        }

        const prom = await s3.headObject(params).promise()
        return prom;
    },
    getDownLoadURl: async (foldername, filename) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename,
            Expires: signedUrlExpireSeconds
        }
        return new Promise((resolve, reject) => {
            s3.getSignedUrl('getObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        })
    },
    getSignedUrlPromise: (operation, params) =>
        new Promise((resolve, reject) => {
            s3.getSignedUrl(operation, params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        }),
    initiateMultipartUpload: async (filename, foldername) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename
        }

        const { UploadId } = await s3.createMultipartUpload(params).promise()
        return UploadId
    },
    generatePresignedUrlsParts: async (filename, foldername, uploadId, partsCount) => {
        const promises =
            Array.from(Array(partsCount).keys())
                .map(partNo => s3.getSignedUrlPromise('uploadPart', {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: foldername + "/" + filename,
                    UploadId: uploadId,
                    PartNumber: partNo + 1

                }))

        const res = await Promise.all(promises)

        return res.reduce((map, part, index) => {
            map[index] = part
            return map
        }, [])
    },
    completeMultiUpload: async (filename, foldername, uploadId, parts) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename,
            UploadId: uploadId,
            MultipartUpload: { Parts: parts }
        }

        const prom = await s3.completeMultipartUpload(params).promise()
        return prom;
    },
    copyFile: async (filename, foldername, parentFolder) => {
        return await s3.copyObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            CopySource: `${process.env.AWS_BUCKET_NAME}/${foldername}/${filename}`,
            Key: `${parentFolder}/${foldername}/${filename}`
        }).promise();

    },
    deleteFile: async (filename, foldername) => {
        return await s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename,
        }).promise();
    },
    abortMultipartUpload: async (filename, foldername, uploadId) => {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foldername + "/" + filename,
            UploadId: uploadId,
        }

        const prom = await s3.abortMultipartUpload(params).promise()
        return prom;
    },
};