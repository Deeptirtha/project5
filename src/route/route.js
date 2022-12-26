const express=require("express")
const router=express.Router()
const {CreatUser,getUser,userLogin,updateUser}= require("../controller/usercontroller")
const {authentication,authorization}= require("../auth/auth")
const {createProduct,getFilteredProduct,getProduct,updateproduct,deleteProductById}=require("../controller/productcontroller")
const {createCart,updateCart,getCart,deleteCart}=require("../controller/cartcontroller")
const {createOrder,updateOrder}=require("../controller/ordercontroller")

//=================================================USER API's===================================================

router.post("/register",CreatUser)

router.post("/login",userLogin)

router.get("/user/:userId/profile",authentication,authorization,getUser)

router.put ("/user/:userId/profile",authentication,authorization,updateUser)

//===============================================PRODUCT API's==================================================

router.post("/products",createProduct)

router.get("/products",getFilteredProduct)

router.get("/products/:productId",getProduct)

router.put("/products/:productId",updateproduct)

router.delete("/products/:productId",deleteProductById)

//===============================================CART API's==================================================

router.post("/users/:userId/cart",authentication,authorization,createCart)

router.put("/users/:userId/cart",authentication,authorization,updateCart)

router.get("/users/:userId/cart",authentication,authorization,getCart)

router.delete("/users/:userId/cart",authentication,authorization,deleteCart)

//===============================================ORDER API's==================================================

router.post("/users/:userId/orders",authentication,authorization,createOrder)

router.put("/users/:userId/orders",authentication,authorization,updateOrder)






router.all("/*" ,function(req,res){
return res.status(404).send({msg:"Galat api hai Boss Dusra rasta chunlijiye AOO KAVI HAVELI MAI"})
})


module.exports = router;