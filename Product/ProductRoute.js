const express = require("express");
const { PostProduct, getAllProduct, getProductById, postReviews, deleteProduct, updateProduct, getProductByOwnerId } = require("./ProductController");
const { isNotUser } = require("../middlewares/verifyRole");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/", verifyToken, isNotUser, PostProduct);

router.get("/", getAllProduct)

router.get("/:id", verifyToken, isNotUser, getProductById)

router.post("/:id/reviews", verifyToken, postReviews)

router.delete("/:id", verifyToken, isNotUser, deleteProduct)

router.put("/:id", verifyToken, isNotUser, updateProduct)

router.get('/getByOwnerId/:id', verifyToken, isNotUser, getProductByOwnerId)
module.exports = router;