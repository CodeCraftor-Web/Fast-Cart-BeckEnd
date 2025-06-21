const jwt = require("jsonwebtoken");

const UserModel = require("../User/UserSchema");

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const refreshToken = req?.cookies?.refreshToken;
  const header = req?.headers?.authorization;
  const accessToken = header?.split(" ")[1];

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
        }
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      } else {
        const user = await UserModel.findOne({ _id: decoded.id });
        req.id = user._id;
        req.user = user;
        next();
      }
    });
  }
};

module.exports = verifyToken;
