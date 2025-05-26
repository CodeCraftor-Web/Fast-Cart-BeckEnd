const express = require("express");
const { PostProduct, getAllProduct, getProductById, postReviews, deleteProduct, updateProduct, getProductByOwnerId, getAllProductByCategory } = require("./ProductController");
const { isNotUser, isAdmin } = require("../middlewares/verifyRole");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", verifyToken, isAdmin, PostProduct);

router.get("/", getAllProduct)

router.get('/categories-with-products', getAllProductByCategory)

router.get("/:id", getProductById)

router.post("/:id/reviews", verifyToken, postReviews)

router.delete("/:id", verifyToken, isAdmin, deleteProduct)

router.put("/:id", verifyToken, isAdmin, updateProduct)

router.get('/getByOwnerId/:id', verifyToken, isAdmin, getProductByOwnerId)


module.exports = router;