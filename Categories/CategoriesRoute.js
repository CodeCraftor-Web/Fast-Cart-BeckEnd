const express = require("express");
const {  postCategory, deleteCategory, getCategory } = require("./CategoriesController");
const { isAdmin } = require("../middlewares/verifyRole");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Get all categories
router.get("/", getCategory);

// Create a new category
router.post("/", verifyToken, isAdmin, postCategory);

// Delete a category by ID
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

module.exports = router;