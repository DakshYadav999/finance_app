import statementRoutes from "./routes/statement.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import kpiRoutes from "./routes/kpi.js";
import KPI from "./models/KPI.js";
import productRoutes from "./routes/product.js";
import transactionRoutes from "./routes/transaction.js"
import Product from "./models/Product.js";
import Transaction from "./models/Transaction.js"
import { kpis,products,transactions } from "./data/data.js";

// CONFIGURATIONS
dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CHANGED: CORS now only allows CLIENT_URL (plus localhost when not in production)
const allowedOrigins = [process.env.CLIENT_URL?.replace(/\/+$/, "")].filter(Boolean);
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173", "http://127.0.0.1:5173");
}
app.use(
  cors({
    origin: (origin, callback) => {
      // no Origin header = curl/Postman/server-to-server, so allow it
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);

// ROUTES
app.use("/kpi", kpiRoutes);
app.use("/product", productRoutes)
app.use("/transaction",transactionRoutes)
app.use("/statement", statementRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () => {
            console.log(`Server Port : ${PORT}`);
        });

       // Seed sample data only when collections are empty
const existingKpis = await KPI.countDocuments();

if (existingKpis === 0) {
    await KPI.insertMany(kpis);
    console.log("Sample KPI data inserted");
}

const existingProducts = await Product.countDocuments();

if (existingProducts === 0) {
    await Product.insertMany(products);
    console.log("Sample Product data inserted");
}

const existingTransactions = await Transaction.countDocuments();

if (existingTransactions === 0) {
    await Transaction.insertMany(transactions);
    console.log("Sample Transaction data inserted");
}

    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });