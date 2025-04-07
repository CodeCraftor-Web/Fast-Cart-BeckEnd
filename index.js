const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConfig");
require("dotenv").config();


// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());


//  Home route
app.get("/", (req, res) => {
  res.send("hello Developers");
});


// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});