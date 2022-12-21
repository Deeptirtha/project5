const express=require("express")
const router=express.Router()
const {CreatUser,getUser,userLogin,updateUser}= require("../controller/usercontroller")
const {authentication,authorization}= require("../auth/auth")
const {createProduct,getFilteredProduct,getProduct,updateproduct}=require("../controller/productcontroller")


//=================================================USER API's===================================================

router.post("/register",CreatUser)

router.post("/login",userLogin)

router.get("/user/:userId/profile",authentication,authorization,getUser)

router.put ("/user/:userId/profile",authentication,authorization,updateUser)

//===============================================PRODUCT API's==================================================

router.post("/products",createProduct)

router.get("/products",getFilteredProduct)

router.get("/products/:productId",getProduct)

router.post("/products/:productId",updateproduct)











router.all("/*" ,function(req,res){
return res.status(404).send({msg:"Galat api hai Boss Dusra rasta chunlijiye AOO KAVI HAVELI MAI"})
})


module.exports = router;