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
      required: true
    },
    cuopon: {
      type: String,
    },
    items: [
      {
        productName: {
          type: String,
          required: true,
        },
        productCategory: { type: String, required: true },
        productId: { type: String, required: true },
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
        calculatedPrice: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        size: {
          type: String,
        },
        color: {
          type: String,
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
    ],
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
      required: true
    },
    paymentNumber: {
      type: String,
    },
    deliveryAddress: {
      division: { type: String, required: true },
      district: { type: String, required: true },
      upazilla: { type: String, required: true },
      village: { type: String },
      addressDetails: {type: String, required: true} 
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("orders", OrderSchema);
module.exports = OrderModel;
