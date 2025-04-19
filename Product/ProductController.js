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
    } = req.body;

    // Validate if required fields exist
    if (!name || !originalPrice || !description || !category || !subCategory || !remainingProducts || !OwnerName || !OwnerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Calculate the product price based on the original price and discount
    const productPrice = originalPrice - (originalPrice * (discount / 100));

    // If colors are provided as an array, don't split them
    const productColors = Array.isArray(colors) ? colors : colors.split(",").map(color => color.trim());

    // If sizes are provided as a string, split them into an array
    const productSizes = sizes.split(",").map(size => size.trim());

    const product = new Product({
      productName: name,
      productOriginalPrice: originalPrice,
      productDiscount: discount,
      productDescription: description,
      productColors: productColors, // Set the colors directly from the array
      productSizes: productSizes, // Handle sizes as array
      productImages: images,
      productCategory: category,
      productSubCategory: subCategory,
      faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
      OwnerName: OwnerName,
      OwnerId: OwnerId,
      remainingProducts: remainingProducts,
      productDetails: productDetails.split(",").map(detail => detail.trim()),
      productPrice: productPrice, // Set the calculated product price
    });

    console.log(product); // Optionally log the product to see its data structure

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category,subCategory, minPrice, maxPrice, sortBy, size } = req.query;

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
        sortOptions.productOriginalPrice = 1;
      } else if (sortBy === "price-high") {
        sortOptions.productOriginalPrice = -1;
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
  const { id } = req.params
  const { name, email, stars, text, date, image } = req.body
  try {
    const product = await Product.findById(id);
    const review = {
      name,
      email,
      stars,
      text,
      date,
      userPhoto: image,
    };
    product.reviews.push(review);
    await product.save();
    res.status(201).json({ message: "Review added successfully", product })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}