import Order from '../models/Order.js';
import mongoose from "mongoose";
import Product from '../models/Product.js';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('customerId');

        if (orders.length === 0) {
            return res.status(404).json({
                status: "error",
                error: "No orders found",
            });
        }

        return res.status(200).json({
            status: "success",
            orders: orders,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: error.message || "An error occurred while retrieving orders",
        });
    }
};

export const createOrder = async (req, res) => {
    const order = req.body;

    if (!order) {
        return res.status(400).json({
            status: "error",
            error: "Order data is missing",
        });
    }

    if (!order.billing_address || !order.shipping_address || !order.customerId) {
        return res.status(400).json({
            status: "error",
            error: "Missing required fields: billing_address, shipping_address, or customerId",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(order.customerId)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid customer ID format",
        });
    }

    try {
        const newOrder = new Order(order);
        await newOrder.save();
        return res.status(201).json({
            status: "success",
            message: "Order successfully created",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: error.message || "An error occurred while saving the order",
        });
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const order = req.body;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing order ID",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid order ID format",
        });
    }

    if (!order.status || !order.billing_address || !order.shipping_address || !order.customerId) {
        return res.status(400).json({
            status: "error",
            error: "Missing required fields: status, billing_address, shipping_address, customerId",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(order.customerId)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid customer ID format",
        });
    }

    try {
        const existingOrder = await Order.findById(id);

        if (!existingOrder) {
            return res.status(404).json({
                status: "error",
                error: "Order not found",
            });
        }

        existingOrder.status = order.status;
        existingOrder.billing_address = order.billing_address;
        existingOrder.shipping_address = order.shipping_address;
        existingOrder.customerId = order.customerId;

        const updatedOrder = await existingOrder.save();

        return res.status(200).json({
            status: "success",
            data: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while updating the order",
        });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing order ID",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid order ID format",
        });
    }

    try {
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                status: "error",
                error: "Order not found",
            });
        }

        await Order.deleteOne({ _id: id });

        return res.status(200).json({
            status: "success",
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: `An error occurred while deleting the order: ${error.message}`,
        });
    }
};
export const directOrder = async (req, res) => {
    const { customerId } = req.params;
    const { billing_address, shipping_address, products } = req.body;

    if (!customerId || !mongoose.Types.ObjectId.isValid(customerId)) {
        return res.status(400).json({
            status: "error",
            error: "Invalid or missing customer ID",
        });
    }

    if (!billing_address || !shipping_address) {
        return res.status(400).json({
            status: "error",
            error: "Missing required fields: billing_address or shipping_address",
        });
    }

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
            status: "error",
            error: "No products selected",
        });
    }

    try {
        const productIds = products.map(product => product.productId);
        const productDocs = await Product.find({ '_id': { $in: productIds } });

        if (productDocs.length !== products.length) {
            return res.status(404).json({
                status: "error",
                error: "Some selected products do not exist",
            });
        }

        for (let i = 0; i < products.length; i++) {
            const product = productDocs.find(p => p._id.toString() === products[i].productId);
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    error: `Product ${products[i].productId} not found`,
                });
            }
            if (product.stock < products[i].quantity) {
                return res.status(400).json({
                    status: "error",
                    error: `Not enough stock for product ${product.name}`,
                });
            }
        }

        const newOrder = new Order({
            customerId,
            billing_address,
            shipping_address,
            products: products.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                price: productDocs.find(prod => prod._id.toString() === p.productId).price,
            })),
            status: 'Pending',
        });

        for (let i = 0; i < products.length; i++) {
            const product = productDocs.find(p => p._id.toString() === products[i].productId);
            product.stock -= products[i].quantity;
            await product.save();
        }

        await newOrder.save();

        return res.status(201).json({
            status: "success",
            message: "Direct order successfully created",
            order: newOrder,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: error.message || "An error occurred while creating the order",
        });
    }
};