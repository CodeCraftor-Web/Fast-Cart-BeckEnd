const Product = require("./ProductSchema");


exports.PostProduct = async (req, res) => {
  try {
    const {
      name,
      originalPrice,
      discount,
      description,
      productDetails,
      colors,
      sizes,
      images,
      category,
      subCategory,
      faqs,
      remainingProducts,
      OwnerName,
      OwnerId,
      video
    } = req.body;
console.log(req.body)
    if (!name || !originalPrice || !description || !category || !subCategory || !remainingProducts || !OwnerName || !OwnerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const productPrice = originalPrice - (originalPrice * (discount / 100));

    const productColors = Array.isArray(colors) ? colors : colors.split(",").map(color => color.trim());

    const productSizes = sizes.split(",").map(size => size.trim());

    const product = new Product({
      productName: name,
      productOriginalPrice: originalPrice,
      productDiscount: discount,
      productDescription: description,
      productColors: productColors,
      productSizes: productSizes,
      productImages: images,
      productCategory: category,
      productSubCategory: subCategory,
      faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
      OwnerName: OwnerName,
      OwnerId: OwnerId,
      remainingProducts: remainingProducts,
      productDetails: productDetails.split(",").map(detail => detail.trim()),
      productPrice: productPrice,
      video: video
    });


    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, subCategory, minPrice, maxPrice, sortBy, size } = req.query;

    const query = {};

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    if (category && category !== 'All') {
      query.productCategory = category;
    }
    if (subCategory && subCategory !== 'All') {
      query.productSubCategory = subCategory;
    }

    if (minPrice || maxPrice) {
      query.productPrice = {};
      if (minPrice) query.productPrice.$gte = Number(minPrice);
      if (maxPrice) query.productPrice.$lte = Number(maxPrice);
    }

    if (size) {
      const sizeArray = size.split(",").map(s => s.trim());
      query.productSizes = {
        $in: sizeArray.map(s => new RegExp(`^\\s*${s}\\s*$`, "i"))
      };
    }



    const sortOptions = {};
    if (sortBy) {
      if (sortBy === "price-low") {
        sortOptions.productPrice = 1;
      } else if (sortBy === "price-high") {
        sortOptions.productPrice = -1;
      } else if (sortBy === "newest") {
        sortOptions.createdAt = -1;
      }
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.postReviews = async (req, res) => {
  const { id } = req.params;
  const { name, email, stars, text, date, image } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    // If the product does not exist
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(review => review.email === email);

    if (alreadyReviewed) {
      return res.status(400).json({success: false, message: "You have already reviewed this product" });
    }

    // Create the review object
    const review = {
      name,
      email,
      stars,
      text,
      date,
      userPhoto: image || "https://i.ibb.co/4f3Yx2C/placeholder.png", // Use default image if not provided
    };

    // Push the new review to the product's reviews array
    product.reviews.push(review);

    // Calculate the new productRating based on all reviews
    const totalStars = product.reviews.reduce((acc, review) => acc + review.stars, 0);
    const newRating = (totalStars / product.reviews.length).toFixed(1); // Round to one decimal place

    // Update the productRating with the new average rating
    product.productRating = parseFloat(newRating); // Ensure it's a number

    // Save the updated product
    await product.save();

    // Respond with the updated product data
    res.status(201).json({ message: "Review added successfully", product });

  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productOriginalPrice,
      productDiscount,
      productDescription,
      productDetails,
      productColors,
      productSizes,
      productCategory,
      productSubCategory,
      faqs,
      remainingProducts,
      OwnerName,
    } = req.body;

    // Validate required fields
    if (
      !productName ||
      !productOriginalPrice ||
      !productDescription ||
      !productCategory ||
      !productSubCategory ||
      !remainingProducts ||
      !OwnerName
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate the discounted price
    const productPrice =
      productOriginalPrice - productOriginalPrice * (productDiscount / 100);

    // Handle product colors (array or comma-separated string)
    const updatedProductColors = Array.isArray(productColors)
      ? productColors
      : productColors.split(",").map((color) => color.trim());

    // Handle product sizes (array or comma-separated string)
    const updatedProductSizes = Array.isArray(productSizes)
      ? productSizes
      : productSizes.split(",").map((size) => size.trim());

    // Handle product details (array or comma-separated string)
    const updatedProductDetails = Array.isArray(productDetails)
      ? productDetails
      : productDetails.split(",").map((detail) => detail.trim());

    // Handle FAQs
    const updatedFaqs = Array.isArray(faqs)
      ? faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))
      : [];

    // Update the product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        productOriginalPrice,
        productDiscount,
        productDescription,
        productColors: updatedProductColors,
        productSizes: updatedProductSizes,
        productCategory,
        productSubCategory,
        faqs: updatedFaqs,
        OwnerName,
        remainingProducts,
        productDetails: updatedProductDetails,
        productPrice,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", product });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProductByOwnerId = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ OwnerId: id });

    if (!products) return res.status(404).json({ message: "Products not found" });
    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


exports.getAllProductByCategory = async (req, res) => {
  try {
    // Step 1: Get all unique categories that have at least one product with > 40% discount
    const categories = await Product.distinct("productCategory", {
      productDiscount: { $gt: 5 },
    });

    // Step 2: For each such category, get top 4 products (with > 40% discount)
    const categoryWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          productCategory: category,
          productDiscount: { $gt: 5 },
        })
          .sort({ createdAt: -1 })
          .limit(4);

        return {
          category,
          products,
        };
      })
    );

    // Step 3: Send the response
    res.status(200).json(categoryWithProducts);

  } catch (error) {
    console.error("Failed to fetch category products:", error);
    res.status(500).send({ error: "Failed to fetch category products" });
  }
};


