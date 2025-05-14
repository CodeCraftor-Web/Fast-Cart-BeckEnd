const validate = require('../middlewares/validator');
const { isAdmin } = require('../middlewares/verifyRole');
const verifyToken = require('../middlewares/verifyToken');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { register, deleteAccount, getUsers, getUserById, deleteAllAccounts, logout, activateUserAccount, signIn, changeRole, refreshAccessToken, getUserBySearch, updateUser, googleAuth, forgotPassword, resetPassword } = require('./UserController');

const router = require('express').Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-account', activateUserAccount);
router.post('/signin', validate(loginSchema), signIn);
router.post('/google-login', googleAuth);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);
router.delete('/delete-user/:id', verifyToken, isAdmin,deleteAccount);
router.delete('/delete-all-users', verifyToken,isAdmin, deleteAllAccounts);
router.get('/get-all-users', verifyToken, isAdmin,  getUsers);
router.get('/get-user-by-search/:searchText', verifyToken,isAdmin, getUserBySearch);
router.get('/get-single-user', verifyToken, getUserById);
router.put('/change-role', verifyToken,isAdmin, changeRole);
router.put('/update-user/:id', verifyToken, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;