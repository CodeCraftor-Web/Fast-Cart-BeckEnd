const jwt = require('jsonwebtoken');
const { createJSONWebToken } = require("../helpers/createJsonWebToken");
const UserModel = require('../User/UserSchema');

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;


const verifyToken = (req, res, next) => {
    const header = req?.headers?.authorization;
    const accessToken = header?.split(' ')[1];
    
    if(!accessToken){
        return res.status(401).json({ message: 'Unauthorized' });
    }else{
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, async(err, decoded)=>{
            console.log(decoded);
            if(err){
                return res.json({success: false, message: 'Unauthorized'})
            }else{
                const user = await UserModel.findOne({_id: decoded.id}); 
                req.id = user._id;
                req.user = user;
                next();
            }
        })
    }
};



module.exports = verifyToken;