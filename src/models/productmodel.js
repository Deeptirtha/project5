const  mongoose  = require("mongoose")


let prductScheema=new mongoose.Schema(
         { 
    title: {type:String, required:true, unique:true,trim:true},
    description: {type:String,required:true,trim:true },
    price: {type:Number,required:true},
    currencyId: {type:String,required:true},
    currencyFormat: {type:String,required:true},
    isFreeShipping: {type:Boolean, default: false},
    productImage: {type:String, required:true},  
    style: {type:String,trim:true},
    availableSizes: {type:[String] , enum:["S", "XS","M","X", "L","XXL", "XL"]},
    installments: {type:Number},
    deletedAt: {type:Date}, 
    isDeleted: {type:Boolean, default: false},
  }, { timestamps: true });

  module.exports = mongoose.model('Product', prductScheema);


  