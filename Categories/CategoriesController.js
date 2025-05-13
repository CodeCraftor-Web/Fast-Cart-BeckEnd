const Category = require("./CategoriesSchema")
const Product = require("../Product/ProductSchema") // Updated path to match your project structure

// Get all categories
const getCategory = async (req, res) => {
  try {
    const categories = await Category.find({})
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new category
const postCategory = async (req, res) => {
  const { categoryName, subCategory, categoryImage } = req.body

  if (!categoryName || !categoryImage || !Array.isArray(subCategory)) {
    return res.status(400).json({ message: "Missing required fields." })
  }

  try {
    // Check if category exists
    const existingCategory = await Category.findOne({ categoryName })

    if (existingCategory) {
      let isUpdated = false

      subCategory.forEach((sub) => {
        const exists = existingCategory.subCategory.some(
          (s) => s.subCategoryName.toLowerCase() === sub.subCategoryName.toLowerCase(),
        )

        if (!exists) {
          existingCategory.subCategory.push(sub)
          isUpdated = true
        }
      })

      if (isUpdated) {
        await existingCategory.save()
        return res.status(200).json({ message: "Sub-category added to existing category.", data: existingCategory })
      } else {
        return res.status(409).json({ message: "Sub-category already exists under this category." })
      }
    }

    // If category doesn't exist, create new
    const newCategory = await Category.create({
      categoryName,
      subCategory,
      categoryImage,
    })

    res.status(201).json({ message: "New category created.", data: newCategory })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params
  const { categoryName, categoryImage } = req.body

  try {
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Update only the fields that are provided
    if (categoryName) category.categoryName = categoryName
    if (categoryImage) category.categoryImage = categoryImage

    const updatedCategory = await category.save()
    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params

  try {
    // First, check if the category exists
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Find all products associated with this category
    const productsToDelete = await Product.find({ productCategory: category.categoryName })

    // Delete all products associated with this category
    if (productsToDelete.length > 0) {
      await Product.deleteMany({ productCategory: category.categoryName })
      console.log(`Deleted ${productsToDelete.length} products associated with category ${category.categoryName}`)
    }

    // Also delete products associated with any subcategory of this category
    for (const subCategory of category.subCategory) {
      const subCategoryProducts = await Product.find({ productSubCategory: subCategory.subCategoryName })
      if (subCategoryProducts.length > 0) {
        await Product.deleteMany({ productSubCategory: subCategory.subCategoryName })
        console.log(
          `Deleted ${subCategoryProducts.length} products associated with subcategory ${subCategory.subCategoryName}`,
        )
      }
    }

    // Now delete the category
    const deletedCategory = await Category.findByIdAndDelete(id)

    res.status(200).json({
      message: "Category and all associated products deleted successfully",
      deletedProductsCount: productsToDelete.length,
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ message: error.message })
  }
}

// Add a subcategory to a category
const addSubCategory = async (req, res) => {
  const { id } = req.params
  const { subCategoryName, subCategoryImage } = req.body

  if (!subCategoryName) {
    return res.status(400).json({ message: "Subcategory name is required" })
  }

  try {
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if subcategory with the same name already exists
    const subCategoryExists = category.subCategory.some(
      (sub) => sub.subCategoryName.toLowerCase() === subCategoryName.toLowerCase(),
    )

    if (subCategoryExists) {
      return res.status(409).json({ message: "Subcategory with this name already exists" })
    }

    // Add new subcategory
    const newSubCategory = {
      subCategoryName,
      subCategoryImage: subCategoryImage || "",
    }

    category.subCategory.push(newSubCategory)
    await category.save()

    // Return the newly added subcategory
    const addedSubCategory = category.subCategory[category.subCategory.length - 1]

    res.status(201).json(addedSubCategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a subcategory
const updateSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params
  const { subCategoryName, subCategoryImage } = req.body

  try {
    const category = await Category.findById(categoryId)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Find the subcategory
    const subCategoryIndex = category.subCategory.findIndex((sub) => sub._id.toString() === subCategoryId)

    if (subCategoryIndex === -1) {
      return res.status(404).json({ message: "Subcategory not found" })
    }

    // Check if new name conflicts with existing subcategories (excluding the current one)
    if (subCategoryName) {
      const nameConflict = category.subCategory.some(
        (sub, index) =>
          index !== subCategoryIndex && sub.subCategoryName.toLowerCase() === subCategoryName.toLowerCase(),
      )

      if (nameConflict) {
        return res.status(409).json({ message: "Another subcategory with this name already exists" })
      }

      category.subCategory[subCategoryIndex].subCategoryName = subCategoryName
    }

    if (subCategoryImage !== undefined) {
      category.subCategory[subCategoryIndex].subCategoryImage = subCategoryImage
    }

    await category.save()

    res.status(200).json(category.subCategory[subCategoryIndex])
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a subcategory
const deleteSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params

  try {
    const category = await Category.findById(categoryId)

    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Find the subcategory
    const subCategoryIndex = category.subCategory.findIndex((sub) => sub._id.toString() === subCategoryId)

    if (subCategoryIndex === -1) {
      return res.status(404).json({ message: "Subcategory not found" })
    }

    const subCategoryName = category.subCategory[subCategoryIndex].subCategoryName

    // Delete all products associated with this subcategory
    const productsToDelete = await Product.find({ productSubCategory: subCategoryName })

    if (productsToDelete.length > 0) {
      await Product.deleteMany({ productSubCategory: subCategoryName })
      console.log(`Deleted ${productsToDelete.length} products associated with subcategory ${subCategoryName}`)
    }

    // Remove the subcategory
    category.subCategory.splice(subCategoryIndex, 1)
    await category.save()

    res.status(200).json({
      message: "Subcategory and all associated products deleted successfully",
      deletedProductsCount: productsToDelete.length,
    })
  } catch (error) {
    console.error("Error deleting subcategory:", error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getCategory,
  getCategoryById,
  postCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
}
