const validate = require('../middlewares/validator');
const { registerSchema, loginSchema } = require('../validation/authSchema');
const { register, deleteAccount, getUsers, getUserById, login, deleteAllAccounts } = require('./UserController');

const router = require('express').Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.delete('/delete-user/:id', deleteAccount);
router.delete('/delete-all-users', deleteAllAccounts);
router.get('/allusers', getUsers);
router.get('/singleuser/:id', getUserById);

module.exports = router;