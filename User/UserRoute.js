const validate = require('../middlewares/validator');
const { isAdmin } = require('../middlewares/verifyRole');
const verifyToken = require('../middlewares/verifyToken');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { register, deleteAccount, getUsers, getUserById, deleteAllAccounts, logout, activateUserAccount, signIn, changeRole, refreshAccessToken, getUserBySearch, updateUser, googleAuth } = require('./UserController');

const router = require('express').Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-account', activateUserAccount);
router.post('/signin', validate(loginSchema), signIn);
router.post('/google-login', googleAuth);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logout);
router.delete('/delete-user/:id', verifyToken, deleteAccount);
router.delete('/delete-all-users', verifyToken, deleteAllAccounts);
router.get('/get-all-users', verifyToken, isAdmin, getUsers);
router.get('/get-user-by-search/:searchText', verifyToken, getUserBySearch);
router.get('/get-single-user', verifyToken, getUserById);
router.put('/change-role', verifyToken, changeRole);
router.put('/update-user/:id', verifyToken, updateUser);

module.exports = router;