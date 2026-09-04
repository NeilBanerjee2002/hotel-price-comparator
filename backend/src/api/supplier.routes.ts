import { Router, Request, Response } from "express";

const router = Router();

const hotelsA = [
    {
        hotelId: "A101",
        name: "Grand Delhi Hotel",
        price: 4500,
    },
    {
        hotelId: "A102",
        name: "Delhi Palace",
        price: 5200,
    },
];

const hotelsB = [
    {
        hotelId: "B101",
        name: "Delhi Residency",
        price: 4000,
    },
    {
        hotelId: "B102",
        name: "Capital Inn",
        price: 4800,
    },
];

const simulateSupplier = async (
    supplier: "A" | "B",
    hotels: typeof hotelsA,
    behavior: string | undefined,
    res: Response
) => {
    if (behavior === "delay") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (behavior === "timeout") {
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    if (behavior === "error") {
        return res.status(500).json({
            message: `Supplier ${supplier} failed`,
        });
    }

    if (behavior === "empty") {
        return res.json([]);
    }

    return res.json(hotels);
};

router.get("/supplierA/hotels", async (req: Request, res: Response) => {
    await simulateSupplier(
        "A",
        hotelsA,
        req.query.behavior as string | undefined,
        res
    );
});

router.get("/supplierB/hotels", async (req: Request, res: Response) => {
    await simulateSupplier(
        "B",
        hotelsB,
        req.query.behavior as string | undefined,
        res
    );
});

export default router;