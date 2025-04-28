const OrderModel = require("./OrderSchema");
const ProductSchema = require("../Product/ProductSchema");

const postOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerId,
            phone,
            items,
            totalPrice,
            paymentMethod,
            paymentNumber,
            ownerId,
            ownerName,
            deliveryAddress,
        } = req.body.data; 


        const addOrder = new OrderModel({
            customerName,
            customerEmail,
            customerId,
            phone,
            items,
            totalPrice,
            paymentMethod,
            paymentNumber,
            ownerId,
            ownerName,
            deliveryAddress,
        });

        await addOrder.save();

        if (addOrder) {
            for (let i = 0; i < items.length; i++) {
                const productId = items[i].productId;
                const quantity = items[i].quantity;
                const productData = await ProductSchema.findById(productId);
                if (productData) {
                    productData.remainingProducts -= quantity;
                    await productData.save();
                }
            }
        }
        res.status(200).json({
            success: true,
            message: "Your order has been placed successfully.",
            order: addOrder,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const getOrderData = await OrderModel.find();

        if (getOrderData.length < 1) {
            return res.status(400).json({ success: false, message: "No order data found!" })
        }

        res.status(200).json({ success: false, message: "Order data returned", getOrderData })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




const deleteOrderDataById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteOrder = await OrderModel.findByIdAndDelete(id);
        if (!deleteOrder) {
            return res.status(400).json({ success: false, message: "Order data cannot be deleted" })
        }
        res.status(200).json({ success: true, message: "Order data deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error.message);
    }
}

const deleteOrderData = async (req, res) => {
    try {
        const deleteOrder = await OrderModel.deleteMany({})
        if (!deleteOrder) {
            return res.status(400).json({ success: false, message: "Order data cannot be deleted" })
        }
        res.status(200).json({ success: true, message: "Order data deleted successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error.message);
    }
}

const getOrdersByOwnerId = async (req, res) => {
    const { id } = req.params;
    try {
        // Using dot notation to query within the 'items' array
        const orders = await OrderModel.find({ 'items.OwnerId': id })

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this ownerId' });
        }

        res.status(200).json({
            success: true,
            message: "Order data returned by OwnerId",
            orderData: orders,
        });
    } catch (error) {
        console.error('Error fetching orders by OwnerId:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
};

const getOrdersByCustomerId = async (req, res) => {
    const { id } = req.params;
    try {
        const orders = await OrderModel.find({ 'customerId': id })

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this customerId' });
        }

        res.status(200).json({
            success: true,
            message: "Order data returned by customerId",
            orderData: orders,
        });
    } catch (error) {
        console.error('Error fetching orders by customerId:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error });
    }
}

const updateStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true } 
        )

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        if (updatedOrder.status === 'delivered') {
            for (let i = 0; i < updatedOrder.items.length; i++) {
                const productId = updatedOrder.items[i].productId;
                const quantity = updatedOrder.items[i].quantity;
                const productData = await ProductSchema.findById(productId);
                if (productData) {
                    productData.sales += quantity;
                    await productData.save();
                }
            }
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            updatedOrder
        })
    } catch (error) {
        console.error('Error updating order status:', error)
        res.status(500).json({ success: false, message: 'Failed to update order status', error })
    }
}



module.exports = { postOrder, getOrder, deleteOrderDataById, deleteOrderData, getOrdersByOwnerId, getOrdersByCustomerId, updateStatus };