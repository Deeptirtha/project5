const jwt = require('jsonwebtoken')


 let Authentication= async (req, res, next) => {
    try {
        let bearerHeader = req.headers.Authorization;
        if (typeof bearerHeader == "undefined") {
            return res.status(401).send({ status: false, message: "Token is missing! please enter token." });
        }
        let bearerToken = bearerHeader.split(' ');  
        let token = bearerToken[1];
        let decodedToken =jwt.verify(token, "")
        req.decodedToken = decodedToken;
        next();
    } catch (error) {
        if(err.message == "jwt expired") return res.status(401).send({ status: false, message: "JWT expired, login again" })
        if(err.message == "invalid signature") return res.status(401).send({ status: false, message: "Token is incorrect authentication failed" })
        return res.status(500).send({ status: false, error: error.message });
    }
}

module.exports={Authentication}