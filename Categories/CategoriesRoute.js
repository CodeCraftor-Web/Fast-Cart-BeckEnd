const express = require("express");
const { 
  getCategory, 
  getCategoryById, 
  postCategory, 
  updateCategory, 
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory
} = require("./CategoriesController");
const { isAdmin } = require("../middlewares/verifyRole");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Category routes
// Get all categories - public access
router.get("/", getCategory);

// Get a single category by ID - public access
router.get("/:id", getCategoryById);

// Create a new category - admin only
router.post("/", verifyToken, isAdmin, postCategory);

// Update a category - admin only
router.put("/:id", verifyToken, isAdmin, updateCategory);

// Delete a category by ID - admin only
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

// Subcategory routes
// Add a subcategory to a category - admin only
router.post("/:id/subcategories", verifyToken, isAdmin, addSubCategory);

// Update a subcategory - admin only
router.put("/:categoryId/subcategories/:subCategoryId", verifyToken, isAdmin, updateSubCategory);

// Delete a subcategory - admin only
router.delete("/:categoryId/subcategories/:subCategoryId", verifyToken, isAdmin, deleteSubCategory);

module.exports = router;