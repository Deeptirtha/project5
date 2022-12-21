const express=require("express")
const router=express.Router()
const {CreatUser,getUser,userLogin,updateUser}= require("../controller/usercontroller")
const {getproductbyid,deleteProductById}=require("../controller/productcontroller")
const {authentication,authorization}= require("../auth/auth")


//==========================userAPI'S===============================//

router.post("/register",CreatUser)

router.post("/login",userLogin)

router.get("/user/:userId/profile",authentication,authorization,getUser)

router.put ("/user/:userId/profile",authentication,authorization,updateUser)


//=======================productAPI'S============================//

router.get("/products/:productId",getproductbyid)
router.delete("/products/:productId",deleteProductById)













router.all("/*" ,function(req,res){
return res.status(404).send({msg:"Galat api hai Boss Dusra rasta chunlijiye AOO KAVI HAVELI MAI"})
})


module.exports = router;