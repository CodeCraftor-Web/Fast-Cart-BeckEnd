const WishList = require("./WishListSchema");


const addToWishlist = async (req, res) => {
  const { customerId } = req.params;
  const { product } = req.body;

  if (!customerId || !product || !product._id) {
    return res.status(400).json({ message: "customerId and product._id are required!" });
  }

  try {
    // Find wishlist
    let findWishList = await WishList.findOne({ customerId });

    if (findWishList) {
      const productExist = findWishList.products.some(item => item._id?.toString() === product._id);
      if (productExist) {
        return res.status(400).json({ success: false, message: "Product already exists to wishlist" });
      }
      findWishList.products.push(product);
      await findWishList.save();

      return res.status(200).json({ success: true, message: "added to wishlist" })
    }
    // If not exist, create a new one

    const wishlist = new WishList({
      customerId: customerId,
      products: [product]
    })
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Wishlist created and product added.",
      wishlist,
    });


  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWishlistByCustomerId = async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ message: "customerId is required." });
  }

  try {
    const wishlist = await WishList.findOne({ customerId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found." });
    }

    res.status(200).json({ wishlist });
  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};

const getAllWishList = async (req, res) => {
  try {
    const wishlist = await WishList.find({});
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const deleteAllWishList = async (req, res) => {
  try {
    const wishlist = await WishList.deleteMany({});
    res.status(200).json({ success: true, message: 'all wishlist deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

const deleteWishListById = async (req, res) => {
  const { customerId, productId } = req.params;
  if (!customerId || !productId) return res.status(400).json({ message: "customerId and productId are required." });

  try {
    const wishlist = await WishList.findOne({ customerId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found." });

    const productExist = wishlist.products.some(item => item._id.toString() === productId);
    if (!productExist) return res.status(404).json({ message: "Product not found in wishlist." });

    wishlist.products = wishlist.products.filter(item => item._id.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Product removed from wishlist.", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




module.exports = { addToWishlist, getWishlistByCustomerId, getAllWishList, deleteAllWishList, deleteWishListById };

