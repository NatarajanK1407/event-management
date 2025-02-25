import dotenv from "dotenv";
import cors from "cors";
import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import pool from "./config/db.js";
import userRoutes from "./Routes/userRoute.js";
import eventRoutes from "./Routes/eventRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Verify PostgreSQL connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL!"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes); // Integrated event routes

app.get("/", (req, res) => res.send("🚀 API is running"));

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
