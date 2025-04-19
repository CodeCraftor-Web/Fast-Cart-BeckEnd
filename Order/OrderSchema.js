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
                description: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
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
            require:true,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", ],
        },     
        deliveryAddress: {
            type: String
        },
        OwnerId: {
            type: String,
            required: true,
        },
        OwnerName: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", OrderSchema);