const express = require("express");
const { PostProduct, getAllProduct, getProductById, postReviews } = require("./ProductController");

const router = express.Router();

router.post("/", PostProduct);

router.get("/" , getAllProduct)

router.get("/:id", getProductById)

router.post("/:id/reviews",postReviews)

module.exports = router;