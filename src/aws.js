const aws = require("aws-sdk")

aws.config.update({
    accessKeyId :"AKIAY3L35MCRZNIRGT6N",
    secretAccessKey : "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",
    region : "ap-south-1"
})

const uploadFile = function(file){
  
    return new Promise((resolve, reject)=>{
        let s3 = new aws.S3({apiVersion:"2006-03-01"})
        let uploadParams = {
            ACL : "public-read",
            Bucket: "classroom-training-bucket",
            Key : "cover/" + file.originalname,
            Body: file.buffer
        }
        
        s3.upload(uploadParams, (err, url)=>{
            if(err){return reject (err)}
        
            return resolve (url.Location)
        })
    })
}
module.exports = {uploadFile}