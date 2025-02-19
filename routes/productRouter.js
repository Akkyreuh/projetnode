import express from "express";
import {getAllProducts, createProduct, getProduct, searchProduct, updateProduct, deleteProduct} from "../controllers/productController.js";

const router = express.Router();


router.get("/api/products", getAllProducts);

router.post("/api/products", createProduct);

router.get("/api/products/:id", getProduct);

router.put("/api/products/:id", updateProduct)

router.delete("/api/products/:id", deleteProduct)

router.get("/api/search", searchProduct);


export default router;
