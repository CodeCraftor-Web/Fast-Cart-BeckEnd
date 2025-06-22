const OrderModel = require("./OrderSchema");
const ProductSchema = require("../Product/ProductSchema");
const axios = require("axios");

const postOrder = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerId,
            phone,
            cuopon,
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
            cuopon,
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
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (updatedOrder.status === "shipped") {
      const district = updatedOrder.deliveryAddress?.district;
      if (!district) {
        return res.status(400).json({ success: false, message: "Delivery district missing" });
      }

      const areasResponse = await axios.get(
        `https://sandbox.redx.com.bd/v1.0.0-beta/areas?district=${encodeURIComponent(district)}`,
        {
          headers: {
            "API-ACCESS-TOKEN": `Bearer ${process.env.REDX_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const delivery_area_id = areasResponse.data.areas?.[0]?.id;

      if (!delivery_area_id) {
        return res.status(400).json({
          success: false,
          message: `Invalid delivery area for district: ${district}`,
        });
      }

      const parcelPayload = {
        customer_name: updatedOrder.customerName,
        customer_phone: updatedOrder.phone,
        delivery_area: district,
        delivery_area_id,
        customer_address: `${updatedOrder.deliveryAddress.village}, ${updatedOrder.deliveryAddress.upazilla}, ${district}`,
        merchant_invoice_id: updatedOrder._id.toString(),
        cash_collection_amount: updatedOrder.totalPrice.toString(),
        parcel_weight: "500", 
        instruction: "Please handle with care",
        value: updatedOrder.totalPrice.toString(),
        is_closed_box: true,
        pickup_store_id: 1,
        parcel_details_json: updatedOrder.items.map((item) => ({
          name: item.productName,
          category: item.productCategory || "Others",
          value: item.calculatedPrice || item.price,
        })),
      };

      const redxResponse = await axios.post(`https://sandbox.redx.com.bd/v1.0.0-beta/parcel`, parcelPayload, {
        headers: {
          "API-ACCESS-TOKEN": `Bearer ${process.env.REDX_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      console.log("RedX Parcel Created:", redxResponse.data);

      updatedOrder.trackingId = redxResponse.data.tracking_id;
      await updatedOrder.save();
      console.log(updatedOrder);
    }

    if (updatedOrder.status === "delivered") {
      for (const item of updatedOrder.items) {
        const product = await ProductSchema.findById(item.productId);
        if (product) {
          product.sales += item.quantity;
          await product.save();
        }
      }
    }

    if (updatedOrder.status === "cancelled") {
      for (const item of updatedOrder.items) {
        const product = await ProductSchema.findById(item.productId);
        if (product) {
          product.remainingProducts += item.quantity;
          await product.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error.response?.data || error.message || error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.response?.data || error.message,
    });
  }
};


const PaymentDetailsAllSellers = async (req, res) => {
    try {
        const orders = await OrderModel.find();

        const sellerPaymentSummary = {};

        orders.forEach(order => {
            const orderMonth = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });

            order.items.forEach(item => {
                const ownerId = item.OwnerId;
                const price = item.calculatedPrice;
                const ownerName = item.OwnerName;

                if (!sellerPaymentSummary[ownerId]) {
                    sellerPaymentSummary[ownerId] = { ownerName };
                }

                if (!sellerPaymentSummary[ownerId][orderMonth]) {
                    sellerPaymentSummary[ownerId][orderMonth] = 0;
                }

                // add price
                sellerPaymentSummary[ownerId][orderMonth] += price;
            });
        });

        res.status(200).json(sellerPaymentSummary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};




module.exports = { postOrder, getOrder, deleteOrderDataById, deleteOrderData, getOrdersByOwnerId, getOrdersByCustomerId, updateStatus, PaymentDetailsAllSellers };