const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    
    products: {type: Array, required: true}
  },
  {
    timestamps: true,
  }
);

const WishList = mongoose.model("wishlists", wishListSchema);
module.exports = WishList;