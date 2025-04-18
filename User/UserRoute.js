const validate = require('../middlewares/validator');
const verifyToken = require('../middlewares/verifyToken');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { register, deleteAccount, getUsers, getUserById, deleteAllAccounts, logout, activateUserAccount, signIn, changeRole, refreshAccessToken } = require('./UserController');

const router = require('express').Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-account', activateUserAccount);
router.post('/signin', validate(loginSchema), signIn);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logout);
router.delete('/delete-user/:id', deleteAccount);
router.delete('/delete-all-users', deleteAllAccounts);
router.get('/get-all-users', getUsers);
router.get('/get-single-user', verifyToken, getUserById);
router.put('/change-role', verifyToken, changeRole);

module.exports = router;