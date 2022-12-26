const orderController= require("../models/ordermodel")

//======================================CREATE ORDER==========================================================//

const createOrder= async function(req,res){
    try{

    }
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}


//========================================UPDATE ORDER========================================================//

const updateOrder = async function(req,res){
    try{

    }
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}



module.exports={createOrder,updateOrder}