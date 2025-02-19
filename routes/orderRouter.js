import express from "express";

import  {getAllOrders , createOrder,directOrder , deleteOrder , updateOrder } from "../controllers/orderController.js"

const router = express.Router();

    router.get("/api/orders" , getAllOrders)

    router.post("/api/orders" , createOrder)

    router.delete("/api/orders/:id" , deleteOrder)

    router.put("/api/orders/:id" , updateOrder)

    router.post('/api/orders/direct/:customerId',directOrder)


export default router;