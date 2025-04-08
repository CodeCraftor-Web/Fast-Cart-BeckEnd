const UserModel = require("./UserSchema");
const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require("../helpers/createJsonWebToken");
const jwtSecretKey = process.env.JWT_SECRET;

const getUsers = async(req, res, ) => {
    try {

        const users = await UserModel.find({});
        if(users.length === 0){
            return res.status(404).json({success: false, message: "No user found"});
        }

        res.status(200).json({success: true, message: "users were returned", users});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

const getUserById = async(req, res, ) => {
    try {
        const {id} = req.params;
        const user = await UserModel.findById(id);
        if(!user){
            res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, message: "users were returned", user});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

const register = async(req, res) => {
    try {
        
        const {name, email, password} = req.body;
        
        const userExists = await UserModel.exists({email});

        if(userExists){
            res.status(400).json({success: false, message: "User already exists!"});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(200).json({success: true, message: "Account created successfully"});
    
    } catch (success) {
        res.status(500).json({success: false, message:error.message});
        console.log(success.message);
    }
}

const login = async(req, res) => {
    try {
        const {email,password} = req.body;

        const userExist = await UserModel.findOne({email});
        if(!userExist){
            return res.status(400).json({success: false, message: "Invalid email/password"})
        }

        // Match Password 
        const passwordMatch = await bcrypt.compare(password, userExist.password);

        if(!passwordMatch){
            return res.status(400).json({success: false, message: "Invalid email/password"})
        }

        // Generate JWT Token
        const token = createJSONWebToken({id: userExist._id, name: userExist.name, email}, jwtSecretKey, "1d");

        // Set Token to Cookie
        // res.cookie("token", token, {
        //     httpOnly: true,   
        //     maxAge: 24 * 60 * 60 * 1000
        // });

        const user = {_id: userExist._id, name: userExist.name, email: userExist.email, token: token}
        
        res.status(200).json({success: true, message: "Login successful", user, token});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}

const deleteAccount = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await UserModel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
  
      res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, success: error.message });
    }
  };

const deleteAllAccounts = async (req, res, next) => {
    try {
  
      const deletedUsers = await UserModel.deleteMany();
  
      if (!deletedUsers) {
        return res.status(404).json({ success: false, message: "Accounts not found" });
      }
  
      res.status(200).json({ success: true, message: "All Accounts deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, success: error.message });
    }
  };

  

module.exports = {register, login, getUsers, getUserById, deleteAccount, deleteAllAccounts};