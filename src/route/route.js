const express= require("express")
const router= express.Router()
const userController= require("../controller/usercontroller") 


router.post("/register",userController.createUser)


router.post("/login",userController.userLogin)

router.get("/user/:userId/profile",userController.getUser)


module.exports= router