const express = require("express");
const { PostProduct, getAllProduct, getProductById, postReviews, deleteProduct, updateProduct, getProductByOwnerId } = require("./ProductController");

const router = express.Router();

router.post("/", PostProduct);

router.get("/", getAllProduct)

router.get("/:id", getProductById)

router.post("/:id/reviews", postReviews)

router.delete("/:id", deleteProduct)

router.put("/:id", updateProduct)

router.get('/getByOwnerId/:id', getProductByOwnerId)
module.exports = router;