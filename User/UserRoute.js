const validate = require('../middlewares/validator');
const verifyToken = require('../middlewares/verifyToken');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { register, deleteAccount, getUsers, getUserById, deleteAllAccounts, logout, activateUserAccount, signIn, refreshJwToken } = require('./UserController');

const router = require('express').Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-account', activateUserAccount);
router.post('/signin', validate(loginSchema), signIn);
router.get('/refresh-token', refreshJwToken);
router.post('/logout', logout);
router.delete('/delete-user/:id', deleteAccount);
router.delete('/delete-all-users', deleteAllAccounts);
router.get('/allusers', getUsers);
router.get('/get-single-user', verifyToken, getUserById);

module.exports = router;