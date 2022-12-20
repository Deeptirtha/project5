const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')
const userModel = require("../models/usermodel")


 let authentication = async function (req, res, next){
    try {
        let bearerHeader = req.headers.authorization
        if (!bearerHeader) {return res.status(401).send({ status: false, message: "Token is missing! please enter token." })}
        let bearerToken = bearerHeader.split(' ');  
        let token = bearerToken[1];
        let decodedToken =jwt.verify(token, "Project5")
        req.decodedToken = decodedToken;
        next();
    } catch (err) {
        if(err.message == "jwt expired") return res.status(401).send({ status: false, message: "JWT expired, login again" })
        if(err.message == "invalid signature") return res.status(401).send({ status: false, message: "Token is incorrect authentication failed" })
        return res.status(500).send({ status: false, error: err.message });
    }
}
let authorization=async function(req,res,next){
    try{
let token=req.decodedToken
let tokenUser=token.userId
let user=req.params.userId

if(!isValidObjectId(user))return res.status(400).send({status:false,message:"please enter a valid userid to get in"})
let UserData=await userModel.findById(user)
if(!UserData)return res.status(404).send({status:false,msg:"No such user present with this userid in our Db"})
if(tokenUser!=user)return res.status(403).send({status:false,msg:"you are not authorised to do this"})
next()

    }
    catch(err){
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports={authentication,authorization}