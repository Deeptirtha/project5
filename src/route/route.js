const express=require("express")
const router=express.Router()
const {CreatUser,getUser,userLogin,updateUser}= require("../controller/usercontroller")
const {authentication}= require("../auth/auth")

router.post("/register",CreatUser)

router.post("/login",userLogin)

router.get("/user/:userId/profile",getUser)

router.put ("/user/:userId/profile",authentication,updateUser)













router.all("/*" ,function(req,res){
return res.status(404).send({msg:"Galat api hai Boss Dusra rasta chunlijiye AOO KAVI HAVELI MAI"})
})


module.exports = router;