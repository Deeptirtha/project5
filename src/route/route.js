const express=require("express")
const router=express.Router()
const {CreatUser}= require("../controller/usercontroller")

router.post("/register",CreatUser)















module.exports = router;