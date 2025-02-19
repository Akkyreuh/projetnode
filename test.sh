#!/bin/bash

# -----------------------------
# Testing Customer Routes
# -----------------------------

# Create a new customer
echo "Creating a new customer..."
curl -X POST http://localhost:5201/api/customers -H "Content-Type: application/json" -d "{\"name\":\"John Doe\", \"email\":\"john.doe@example.com\", \"phone\":1234567890}"
# Get all customers
echo "Getting all customers..."
curl -X GET http://localhost:5201/api/customers
echo ""

# -----------------------------
# Testing Product Routes
# -----------------------------

# Create a new product
echo "Creating a new product..."
curl -X POST http://localhost:5201/api/products -H "Content-Type: application/json" -d "{\"name\":\"Pencil\", \"quantity\":100, \"price\":1.5, \"stock\":200}"echo ""

# Get all products
echo "Getting all products..."
curl -X GET http://localhost:5201/api/products
echo ""

# Get a specific product by ID (replace with an actual product ID)
PRODUCT_ID="67b4b761310da866f40e91d6" # Example product ID
echo "Getting product with ID $PRODUCT_ID..."
curl -X GET http://localhost:5201/api/products/$PRODUCT_ID
echo ""

# Update product (replace with actual product ID)
echo "Updating product with ID $PRODUCT_ID..."
curl -X PUT http://localhost:5201/api/products/$PRODUCT_ID -H "Content-Type: application/json" -d '{"name":"Updated Pencil", "quantity":150, "price":2.0, "stock":250}'
echo ""

# Delete product (replace with actual product ID)
echo "Deleting product with ID $PRODUCT_ID..."
curl -X DELETE http://localhost:5201/api/products/$PRODUCT_ID
echo ""

# Search product (by name)

echo "Searching product by name :"
curl -X GET "http://localhost:5201/api/search?query=pencil"
echo ""

# -----------------------------
# Testing Order Routes
# -----------------------------

# Create a new order (replace with an actual customer ID and products)
echo "Creating a new order..."
curl -X POST http://localhost:5201/api/orders -H "Content-Type: application/json" -d "{\"status\":\"pending\", \"billing_address\":\"123 Main St\", \"shipping_address\":\"456 Elm St\", \"customerId\":\"67b515e263d6e6da0bf9d39b\"}"
echo ""

# Get all orders
echo "Getting all orders..."
curl -X GET http://localhost:5201/api/orders
echo ""

# Update order (replace with an actual order ID)
ORDER_ID="67b515e263d6e6da0bf9d39b" # Example order ID
echo "Updating order with ID $ORDER_ID..."
curl -X PUT http://localhost:5201/api/orders/$ORDER_ID -H "Content-Type: application/json" -d "{\"status\":\"shipped\", \"billing_address\":\"123 Main St\", \"shipping_address\":\"789 Oak St\", \"customerId\":\"67b515e263d6e6da0bf9d39b\"}"
echo ""

# Delete order (replace with an actual order ID)
echo "Deleting order with ID $ORDER_ID..."
curl -X DELETE http://localhost:5201/api/orders/67b515e263d6e6da0bf9d39b
echo ""

# -----------------------------
# Testing Direct Order Route
# -----------------------------

# Place a direct order for a customer (replace with an actual customer ID)
CUSTOMER_ID="67b515e263d6e6da0bf9d39b" # Example customer ID
echo "Placing a direct order for customer with ID $CUSTOMER_ID..."
curl -X POST http://localhost:5201/api/orders/direct/$CUSTOMER_ID -H "Content-Type: application/json" -d "{\"status\":\"pending\", \"billing_address\":\"123 Main St\", \"shipping_address\":\"456 Elm St\", \"products\":[{\"productId\":\"$PRODUCT_ID\", \"quantity\":10}]}"echo ""

