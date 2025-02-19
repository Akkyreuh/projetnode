import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import {connectDB} from "./config/db.js";

import productRouter from "./routes/productRouter.js";
import customerRouter from "./routes/customerRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

dotenv.config();

app.use(express.json());


app.use(productRouter);
app.use(customerRouter);
app.use(orderRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
