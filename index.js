require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/dbConfig");
const userRouter = require('./User/UserRoute');
const categoriesRouter = require('./Categories/CategoriesRoute');
const productRouter = require('./Product/ProductRoute');
const orderRouter = require('./Order/OrderRoute');
const wishListRouter = require('./Wishlist/WishListRoute');

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH" , "OPTIONS"],
    credentials: true,
  })
);

app.use('/api/user', userRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishListRouter);


//  Home route
app.get("/", (req, res) => {
  res.send("hello Developers");
});


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});