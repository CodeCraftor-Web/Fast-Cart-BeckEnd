const verifyToken = require('../middlewares/verifyToken');
const { postOrder, getOrder, deleteOrderDataById, deleteOrderData, getOrdersByOwnerId } = require('./OrderController');

const router = require('express').Router();

router.post('/post-order', verifyToken, postOrder);
router.get('/get-order', getOrder);
router.get('/get-order/:id', getOrdersByOwnerId);
router.get('/get-order-by-ownerId/:id', getOrdersByOwnerId);
router.delete('/delete-order/:id', deleteOrderDataById);
router.delete('/delete-all-order-data', deleteOrderData);

module.exports = router;