import express from "express";

import { getAllCustomers , createCustomer} from "../controllers/customerController.js";

const router = express.Router();


router.get("/api/customers", getAllCustomers)

router.post("/api/customers", createCustomer)

export default router;