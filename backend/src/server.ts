import express from "express";
import cors from "cors";
import supplierRoutes from "./api/supplier.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "Hotel Rate Comparator backend is running",
    });
});

app.use(supplierRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});