import { Router, Request, Response } from "express";
import { getTemporalClient } from "../temporal/client";
import { HotelSearchRequest } from "../types/hotel";

const router = Router();

router.post("/api/search-hotels", async (req: Request, res: Response) => {
    try {
        const request: HotelSearchRequest = req.body;

        const client = await getTemporalClient();

        const workflowId = `hotel-search-${Date.now()}`;

        await client.start("hotelSearchWorkflow", {
            taskQueue: "hotel-search",
            args: [request],
            workflowId,
        });

        res.json({
            workflowId,
        });
    } catch (error) {
        console.error("Hotel search failed:", error);

        res.status(500).json({
            message: "Hotel search failed",
        });
    }
});

router.get(
    "/api/search-hotels/:workflowId",
    async (req: Request, res: Response) => {
        try {
            const workflowId = String(req.params.workflowId);

            const client = await getTemporalClient();
            const handle = client.getHandle(workflowId);

            const result = await handle.result();

            res.json(result);
        } catch (error) {
            console.error("Hotel search result failed:", error);

            res.status(500).json({
                message: "Hotel search failed",
            });
        }
    }
);

router.post(
    "/api/search-hotels/:workflowId/cancel",
    async (req: Request, res: Response) => {
        try {
            const workflowId = String(req.params.workflowId);

            const client = await getTemporalClient();
            const handle = client.getHandle(workflowId);

            await handle.cancel();

            res.json({
                message: "Hotel search cancelled",
            });
        } catch (error) {
            console.error("Hotel search cancellation failed:", error);

            res.status(500).json({
                message: "Hotel search cancellation failed",
            });
        }
    }
);

export default router;