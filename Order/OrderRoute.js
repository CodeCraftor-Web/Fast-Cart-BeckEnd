const { isOwner, isAdmin, isNotUser } = require('../middlewares/verifyRole');
const verifyToken = require('../middlewares/verifyToken');
const { postOrder, getOrder, deleteOrderDataById, deleteOrderData, getOrdersByOwnerId, getOrdersByCustomerId, updateStatus } = require('./OrderController');

const router = require('express').Router();

router.post('/post-order', verifyToken, postOrder);
router.get('/get-order', verifyToken, isAdmin, getOrder);
router.get('/get-order-by-ownerId/:id', verifyToken, isNotUser, getOrdersByOwnerId);
router.get('/get-order-by-customerId/:id', verifyToken, getOrdersByCustomerId);
router.delete('/delete-order/:id', verifyToken, deleteOrderDataById);
router.delete('/delete-all-order-data', verifyToken, deleteOrderData);
router.patch('/update-status/:id', updateStatus);

module.exports = router; 