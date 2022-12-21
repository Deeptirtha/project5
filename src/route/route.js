const express= require("express")
const router= express.Router()
const userController= require("../controller/usercontroller") 
const productController= require("../controller/productcontroller")

//=================================================USER API's============================================//
router.post("/register",userController.createUser)

router.post("/login",userController.userLogin)

router.get("/user/:userId/profile",userController.getUser)

router.put("/user/:userId/profile",userController.updateUser)

//===============================================PRODUCT API's===================================================//
router.post("/products",productController.createProduct)

//router.get("/products",productController.getProductByQuery)
router.get("/products",productController.getFilteredProduct)

router.get("/products/:productId",productController.getProduct)

router.put("/products/:productId",productController.updateProduct)

router.delete("/products/:productId",productController.deleteProduct)


router.all("/*" ,function(req,res){
    return res.status(404).send({msg:"Path not found"})})

module.exports= router