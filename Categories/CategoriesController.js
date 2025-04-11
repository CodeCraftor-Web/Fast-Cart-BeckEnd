const Category = require("./CategoriesSchema");

// Get all categories
const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new category
const postCategory = async (req, res) => {
    const { categoryName, subCategory, categoryImage } = req.body;

    if (!categoryName || !categoryImage || !Array.isArray(subCategory)) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    try {
        const newCategory = await Category.create({
            categoryName,
            subCategory,
            categoryImage,
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await Category.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getCategory,
    getCategoryById,
    postCategory,
    updateCategory,
    deleteCategory,
};