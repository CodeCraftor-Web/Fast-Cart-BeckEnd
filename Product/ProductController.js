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
      faqs,
      dressStyle,
      remainingProducts,
    } = req.body;

    // Calculate the product price based on the original price and discount
    const productPrice = originalPrice - (originalPrice * (discount / 100));

    const product = new Product({
      productName: name,
      productOriginalPrice: originalPrice,
      productDiscount: discount,
      productDescription: description,
      productColors: colors.split(",").map(color => color.trim()),
      productSizes: sizes.split(",").map(size => size.trim()),
      productImages: images,
      productCategory: category,
      faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
      dressStyle: dressStyle,
      remainingProducts: remainingProducts,
      productDetails: productDetails.split(",").map(detail => detail.trim()),
      productPrice: productPrice, // Set the calculated product price
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sortBy, size } = req.query;

    const query = {};

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    if (category && category !== 'All') {
      query.productCategory = category;
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

exports.postReviews =async (req,res)=>{
  const {id}=req.params
  const {name,email,stars,text,date , image}=req.body
  try {
    const product = await Product.findById(id);
    const review ={
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