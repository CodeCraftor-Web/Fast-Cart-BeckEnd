const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productSubCategory: {
      type: String,
      required: true,
    },
    OwnerId: {
      type: String,
      required: true,
    },
    OwnerName: {
      type: String,
      required: true,
    },
    productOriginalPrice: {
      type: Number,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productDiscount: {
      type: Number, // Change this to Number for consistency
    },
    productDescription: {
      type: String,
      required: true,
    },
    productColors: [
      {
        type: String,
      },
    ],
    productSizes: [
      {
        type: String,
      },
    ],
    productImages: [
      {
        type: String,
      },
    ],
    productDetails: [
      {
        type: String,
        required: true,
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    reviews: [
      {
        name: {
          type: String,
        },
        email: {
          type: String,
        },
        stars: {
          type: Number,
        },
        text: {
          type: String,
        },
        date: {
          type: String,
        },
        userPhoto: {
          type: String,
        },
      },
    ],
    remainingProducts: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
    productRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model("Product", ProductSchema);
