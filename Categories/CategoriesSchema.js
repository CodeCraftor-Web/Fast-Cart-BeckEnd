const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
        },
        subCategory: [
            {
                subCategoryName: {
                    type: String,
                    required: true,
                },
                subCategoryImage: {
                    type: String,
                    required: true,
                },
            },
        ],
        categoryImage: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", categoriesSchema);