const jwt = require('jsonwebtoken')
const userModel = require("../models/usermodel")


 let authentication = async function (req, res, next){
    try {
        let bearerHeader = req.headers.authorization
        if (!bearerHeader) {return res.status(401).send({ status: false, message: "Token is missing! please enter token." })}
        let bearerToken = bearerHeader.split(' ');  
        let token = bearerToken[1];
        let decodedToken =jwt.verify(token, "Project5")
        console.log(decodedToken)
        req.decodedToken = decodedToken;
        next();
    } catch (err) {
        if(err.message == "jwt expired") return res.status(401).send({ status: false, message: "JWT expired, login again" })
        if(err.message == "invalid signature") return res.status(401).send({ status: false, message: "Token is incorrect authentication failed" })
        return res.status(500).send({ status: false, error: err.message });
    }
}

module.exports={authentication}