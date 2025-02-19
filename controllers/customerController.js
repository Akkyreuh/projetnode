import Customer from "../models/Customer.js";

export const getAllCustomers = async (req, res) => {
    try  {
        const customers = await Customer.find({});
        if (customers.length === 0) {
            return res.status(404).json({
                status: "error",
                error: "No customers found",
            });
        }

        return res.status(200).json({
            status: "success",
            customers: customers,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while fetching customers",
        });
    }
}

export const createCustomer = async (req, res) => {
    const customer = req.body;

    if (!customer) {
        return res.status(400).json({
            status: "error",
            error: "Customer data is missing",
        });
    }

    if (!customer.name || !customer.email || !customer.phone) {
        return res.status(400).json({
            status: "error",
            error: "Missing required customer fields: name, email, phone",
        });
    }

    try {
        const existingCustomer = await Customer.findOne({ email: customer.email });

        if (existingCustomer) {
            return res.status(409).json({
                status: "error",
                error: "A customer with this email already exists",
            });
        }

        const newCustomer = new Customer(customer);
        await newCustomer.save();

        return res.status(201).json({
            status: "success",
            message: "Customer created successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            error: "An error occurred while creating the customer",
        });
    }
}
