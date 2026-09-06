"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../temporal/client");
const router = (0, express_1.Router)();
router.post("/api/search-hotels", async (req, res) => {
    try {
        const request = req.body;
        const client = await (0, client_1.getTemporalClient)();
        const workflowId = `hotel-search-${Date.now()}`;
        await client.start("hotelSearchWorkflow", {
            taskQueue: "hotel-search",
            args: [request],
            workflowId,
        });
        res.json({
            workflowId,
        });
    }
    catch (error) {
        console.error("Hotel search failed:", error);
        res.status(500).json({
            message: "Hotel search failed",
        });
    }
});
router.get("/api/search-hotels/:workflowId", async (req, res) => {
    try {
        const workflowId = String(req.params.workflowId);
        const client = await (0, client_1.getTemporalClient)();
        const handle = client.getHandle(workflowId);
        const result = await handle.result();
        res.json(result);
    }
    catch (error) {
        console.error("Hotel search result failed:", error);
        res.status(500).json({
            message: "Hotel search failed",
        });
    }
});
router.post("/api/search-hotels/:workflowId/cancel", async (req, res) => {
    try {
        const workflowId = String(req.params.workflowId);
        const client = await (0, client_1.getTemporalClient)();
        const handle = client.getHandle(workflowId);
        await handle.cancel();
        res.json({
            message: "Hotel search cancelled",
        });
    }
    catch (error) {
        console.error("Hotel search cancellation failed:", error);
        res.status(500).json({
            message: "Hotel search cancellation failed",
        });
    }
});
exports.default = router;
