const productModel=require("../models/productmodel")
const  { uploadFile }=require("../aws")
const{isValidSize,isValidPrice,isValidObjectId}=  require("../validation/validation")
const { off } = require("../models/productmodel")



//===========================================================create product==================================================================

const createProduct= async function(req,res){
    try{
         let data= req.body
         let files= req.files
         let {title, description,price,currencyId,currencyFormat,availableSizes}=data
         if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"Data should be present in request body"})
         }

                  
        let arr=Object.keys(data)
        for(i of arr){
         if(data[i]=="")return res.status(400).send({status:false,msg:` ${i} cam't be empty`})
        }

         if(!title){return res.status(400).send({status:false,message:"Title should be present"})}  

         if(!description){return res.status(400).send({status:false,message:"Description should be present"})}

         if(!price){return res.status(400).send({status:false,message:"Price should be present"})}
         if(!isValidPrice(price)){return res.status(400).send({status:false,message:"Price can be numeric or decimal"})}

         if(!currencyId){return res.status(400).send({status:false,message:"currencyId should be present"})}
         if(currencyId !=="INR"){return res.status(400).send({status:false,message:"currencyId should be in INR format"})}

         if(!currencyFormat){return res.status(400).send({status:false,message:"currencyFormat should be present"})}
         if(currencyFormat!=="₹"){return res.status(400).send({status:false,message:"currencyFormat should be this-₹ "})}

        if(data.installments){
        if(isNaN(data.installments))return res.status(400).send({status:false,msg:"Please put installments in Number"})}
        

        if(data.isFreeShipping){
          if(["false","true"].indexOf(data.isFreeShipping)<0 ){
            return res.status(400).send({status:false,msg:"Enter isFreeShipping in boolian form"})
          }
        }
        
         let uploadImage= await uploadFile(files[0])
         if(!uploadImage){return res.status(400).send({status:false,message:"productImage should be present"})}
         data.productImage=uploadImage

        if(availableSizes){
        let size= availableSizes.toUpperCase().split(" ")
         for(let i=0;i<size.length;i++){   
         if(!isValidSize(size[i])){return res.status(400).send({status:false,message:"Available sizes can be only these-S, XS, M ,X, L, XXL, XL"})}
         }
            data.availableSizes=size
        }

        if(data.installments){
          if(isNaN(data.installments))return res.status(400).send({status:false,msg:"Please put installments in Number"})}
       
        if(data.isDeleted=="true"){data.deletedAt=Date.now()}

        
         let product= await productModel.create(data)  
         return res.status(201).send({status:true,message:"product created successfully",data:product})
    }
    catch(error){
        if(error.code==11000){return res.status(400).send({status:false,message:"title should be unique"})}

        return res.status(500).send({status:false,message:error.message})
    }
}

//=======================================================GET PRODUCT BY QUERY PARAMS========================================================


const getFilteredProduct = async function (req, res){
    try {
      let data = req.query
      let conditions = { isDeleted: false}
  
     if(Object.keys(data).length==0) {
        let getProducts = await productModel.find(conditions).sort({ price: data.priceSort });
        if(getProducts.length == 0) return res.status(404).send({ status: false, message: "No products found" });
         return res.status(200).send({ status: true,message: "Success", data: getProducts })
      }
    
      if (data.priceSort){
        if(["1","-1"].indexOf(data.priceSort)<0){return res.status(400).send({status:false,msg:"Please enter a valid sort order between 1 or -1"})}
      }

      if(data.size) {
        data.size = data.size.toUpperCase();
        if(!isValidSize(data.size)) return res.status(400).send({ status: false, message: "please enter a valid  size" })
        conditions.availableSizes = {$in:data.size}}
  
      if(data.name) {conditions.title = {$regex:data.name,$options:'i'}}
  
      
      if(data.priceGreaterThan || data.priceLessThan) {
        if(isNaN(data.priceGreaterThan )|| isNaN(data.priceLessThan))return res.status(400).send({status:false,msg:"Enter a valid price to get your product"})
        if(data.priceGreaterThan && data.priceLessThan){conditions.price={$gte:data.priceGreaterThan,$lte:data.priceLessThan}}
        else if(data.priceGreaterThan){conditions.price={$gt:data.priceGreaterThan}}
        else{conditions.price={$lte:data.priceLessThan}}}


      let getFilterProduct = await productModel.find(conditions).sort({ price:data.priceSort })
      if(getFilterProduct.length == 0) return res.status(404).send({ status: false, message: "No products found" });
  
      res.status(200).send({ status: true,message: "Success", data: getFilterProduct})
    } 
    catch (err) {
      // let a=err.message.split(" ")
      // if(a.includes("sort"))return res.send({status:false,msg:"Please enter a valid sort order between 1 or -1"})
      res.status(500).send({ status: false, error: err.message });
    }
  }



  //=============================================================GET PRODUCT BY ID==============================================================

const getProduct= async function(req,res){
    try{
       let productId= req.params.productId
       if(!isValidObjectId(productId)){
        return res.status(400).send({status:false,message:"invalid productId,please provide correct productId"})
       }
         let findProduct= await productModel.findOne({_id:productId,isDeleted:false})
         if(!findProduct){return res.status(404).send({status:false,message:"product not found"})}
         return res.status(200).send({status:true,message:"success",data:findProduct})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
    }

//=============================================================UPDATE PRODUCT BY ID==============================================================
    const updateproduct = async function (req, res) {
      try {
        let productId = req.params.productId
        let data = req.body
        const files = req.files

        if(Object.keys(data).length==0) return res.status(400).send({status: false ,message: 'provide data to update'})
        let { title, description, price,isFreeShipping,style,availableSizes, installments,currencyId,currencyFormat } = data

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'productId is not in valid format' })
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if (!product) return res.status(404).send({ status: false, message: 'product not found' })

         
        let arr=Object.keys(data)
        for(i of arr){
         if(data[i]=="")return res.status(400).send({status:false,msg:`Enter ${i} in correct formate`})
        }

        if (title) {
          if (!title.trim()) { return res.status(400).send({ status: false, message: "Title should be present" }) }}

        if (description) {
          if (!description.trim()) { return res.status(400).send({ status: false, message: "Description should be present" }) } }

        if (price) {
          if (!isValidPrice(price)) { return res.status(400).send({ status: false, message: "Price can be numeric or decimal" }) } }
    
        if (currencyId) {
          if (currencyId.trim() !== "INR") { return res.status(400).send({ status: false, message: "currencyId should be in INR format" }) } }
    
        if (currencyFormat) {
          if (currencyFormat.trim() !== "₹") { return res.status(400).send({ status: false, message: "currencyFormat should be this-₹ " }) } }

       if(installments){
       if(isNaN(installments))return res.status(400).send({status:false,msg:"Please put installments in Number"})}
       
        if (files.length>0) {
          let uploadImage = await uploadFile(files[0])
          if (!uploadImage) { return res.status(400).send({ status: false, message: "productImage should be present" }) }
          data.productImage = uploadImage
        }
       
        if(isFreeShipping){
          if(["false","true"].indexOf(isFreeShipping)<0 ){
            return res.status(400).send({status:false,msg:"Enter isFreeShipping in boolian form"})
          }
        }




        //if(isFreeShipping||isFreeShipping==="")
          //if(isFreeShipping=="")return res.status(400).send({status:false,msg:"Enter isFreeShipping in boolian form"})




        if (availableSizes) {
          let size = availableSizes.toUpperCase().split(" ")
          for (let i = 0; i < size.length; i++) {
            if (!isValidSize(size[i])) { return res.status(400).send({ status: false, message: "Available sizes can be only these-S, XS, M ,X, L, XXL, XL" }) }
          }
          data.availableSizes = size
        }
       let UpdateProduct= await productModel.findOneAndUpdate({_id:productId},data,{new:true})  
       return res.status(201).send({status:true,message:"product updated successfully",data:UpdateProduct})
    }
         
    
      catch(error){
        console.log(error)
        return res.status(500).send({status:false,message:error.message})
      }
        
    }





module.exports={createProduct,getFilteredProduct,getProduct,updateproduct}

