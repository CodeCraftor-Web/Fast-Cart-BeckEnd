const express = require("express");
const {  postCategory, deleteCategory, getCategory } = require("./CategoriesController");

const router = express.Router();

// Get all categories
router.get("/", getCategory);

// Create a new category
router.post("/", postCategory);

// Delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;