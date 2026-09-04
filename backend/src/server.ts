import express from "express";
import cors from "cors";
import supplierRoutes from "./api/supplier.routes";
import searchRoutes from "./api/search.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(searchRoutes);

app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "Hotel Rate Comparator backend is running",
    });
});

app.use(supplierRoutes);

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});