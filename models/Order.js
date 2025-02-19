import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
        status: {
            type: String,
            required: true,
        },
        billing_address: {
            type: String,
            required: true,
        },
        shipping_address: {
            type: String,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        }
    },
    {timestamps: true}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
