const { addToWishlist, getWishlistByCustomerId, getAllWishList, deleteAllWishList, deleteWishListById } = require('./WishListController');


const router = require('express').Router();

router.post('/add-to-wishlist/:customerId', addToWishlist);
router.get('/get-wishlist/:customerId', getWishlistByCustomerId);
router.get('/get-all-wishlist', getAllWishList);
router.delete('/delete-all-wishlist', deleteAllWishList);
router.delete('/remove/:customerId/:productId', deleteWishListById);

module.exports = router; 