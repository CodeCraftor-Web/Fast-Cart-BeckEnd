const verifyToken = require('../middlewares/verifyToken');
const { addToWishlist, getWishlistByCustomerId, getAllWishList, deleteAllWishList, deleteWishListById } = require('./WishListController');


const router = require('express').Router();

router.post('/add-to-wishlist/:customerId', verifyToken, addToWishlist);
router.get('/get-wishlist/:customerId', verifyToken, getWishlistByCustomerId);
router.get('/get-all-wishlist', verifyToken, getAllWishList);
router.delete('/delete-all-wishlist', verifyToken, deleteAllWishList);
router.delete('/remove/:customerId/:productId', verifyToken, deleteWishListById);

module.exports = router; 