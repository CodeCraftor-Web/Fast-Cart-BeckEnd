const OrderModel = require("./OrderSchema");




const postOrder = async(req, res) => {
        try {
            const {data} = req.body;
            
            const addOrder =  new OrderModel(data);
            await addOrder.save();

            res.status(200).json({success: false, message: "Your order has been placed Successfully", addOrder})
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
            console.log(error.message);
        }
};

const getOrder = async(req, res) => {
        try {
            const getOrderData = await OrderModel.find();

            if(getOrderData.length < 1){
                return res.status(400).json({success: false, message: "No order data found!"})
            }

            res.status(200).json({success: false, message: "Order data returned", getOrderData})
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
};

const getOrderByUserId = async(req, res) => {
        try {
            const {id} = req.params;
            const orderData = await OrderModel.findOne({customerId: id});
            if(!orderData){
                return res.status(400).json({success: false, message: "No order data found by this ID!"})
            }
            res.status(200).json({success: false, message: "Order data returned by ID", orderData})
        } catch (error) {
            res.status(500).json({success: false, message: error.message});
        }
};


const deleteOrderDataById = async(req, res) => {
    try {
        const {id} = req.params;
        const deleteOrder = await OrderModel.findByIdAndDelete(id);
        if(!deleteOrder){
            return res.status(400).json({success: false, message: "Order data cannot be deleted"})
        }
        res.status(200).json({success: true, message: "Order data deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
        console.log(error.message);
    }
}

const deleteOrderData = async(req, res) => {
    try {
        const deleteOrder = await OrderModel.deleteMany({})
        if(!deleteOrder){
            return res.status(400).json({success: false, message: "Order data cannot be deleted"})
        }
        res.status(200).json({success: true, message: "Order data deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
        console.log(error.message);
    }
}



module.exports = {postOrder, getOrder, getOrderByUserId, deleteOrderDataById, deleteOrderData}