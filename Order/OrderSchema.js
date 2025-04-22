const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
            required: true,    
        },
        customerId: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        items: [
            {
                productName: {
                    type: String,
                    required: true,
                },
                productId: {type: String, required: true},
                description: {
                    type: String,
                    
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                image: {type: String},
                size : {
                    type: String,
                },
                color: {
                    type: String,
                }
            },
        ],
        totalPrice: {
            type: Number
        },
        status: {
            type: String,
            required:true,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", ],
        }, 
        paymentNumber: {
            type: String,
        },
        deliveryAddress: {
            type: String
        },
        OwnerId: {
            type: String,
            
        },
        OwnerName: {
            type: String,
            
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;