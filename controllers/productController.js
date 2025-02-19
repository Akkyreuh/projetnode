import Product from '../models/Product.js';
import mongoose from "mongoose";

export const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
        return res.status(400).json({
            status: "error",
            error: "Invalid page or limit",
        });
    }

    try {
        const products = await Product.find({})
            .skip((pageNumber - 1) * limitNumber) // Skips the number of documents for pagination
            .limit(limitNumber); // Limits the results per page

        if (products.length === 0) {
            return res.status(404).json({
                status: "error",
                error: "No products found",
            });
        }

        const totalProducts = await Product.countDocuments();

        return res.status(200).json({
            status: "success",
            products: products,
            pagination: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / limitNumber),
                currentPage: pageNumber,
                perPage: limitNumber,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while fetching the products",
        });
    }
};


export const createProduct = async (req, res) => {
    const product = req.body;

    if (!product) {
        return res.status(400).json({
            status: "error",
            error: "Product data is missing",
        });
    }

    if (!product.name || !product.quantity || !product.price) {
        return res.status(400).json({
            status: "error",
            error: "Missing required product fields: name, quantity, price",
        });
    }

    if (product.quantity < 0) {
        return res.status(400).json({
            status: "error",
            error: "Quantity cannot be negative",
        });
    }

    if (product.price < 0) {
        return res.status(400).json({
            status: "error",
            error: "Price cannot be negative",
        });
    }

    try {
        const newProduct = new Product(product);
        await newProduct.save();
        return res.status(201).json({
            status: "success",
            message: "Product created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while creating the product",
        });
    }
};

export const getProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing product ID in request parameters",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid product ID format",
        });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Product not found",
            });
        }

        return res.status(200).json({
            status: "success",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while fetching the product",
        });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing product ID in request parameters",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid product ID format",
        });
    }

    if (!product.name || !product.quantity || !product.price || ! product.stock) {
        return res.status(400).json({
            status: "error",
            error: "Missing required product fields: name, quantity, price",
        });
    }

    if (product.quantity < 0) {
        return res.status(400).json({
            status: "error",
            error: "Quantity cannot be negative",
        });
    }

    if (product.price < 0) {
        return res.status(400).json({
            status: "error",
            error: "Price cannot be negative",
        });
    }

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({
                status: "error",
                error: "Product not found",
            });
        }

        existingProduct.name = product.name;
        existingProduct.quantity = product.quantity;
        existingProduct.price = product.price;

        const updatedProduct = await existingProduct.save();

        return res.status(200).json({
            status: "success",
            data: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while updating the product",
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing product ID in request parameters",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid product ID format",
        });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Product not found",
            });
        }

        await Product.deleteOne({ _id: id });

        return res.status(200).json({
            status: "success",
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: `An error occurred while deleting the product: ${error.message}`,
        });
    }
};

export const searchProduct = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            status: "error",
            error: "Search query is missing",
        });
    }

    try {
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });

        if (products.length === 0) {
            return res.status(404).json({
                status: "error",
                error: "No products found matching the search query",
            });
        }

        return res.status(200).json({
            status: "success",
            count: products.length,
            products: products,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: `An error occurred while searching for products: ${error.message}`,
        });
    }
};