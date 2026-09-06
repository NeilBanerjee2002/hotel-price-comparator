"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelSearchWorkflow = hotelSearchWorkflow;
const workflow_1 = require("@temporalio/workflow");
const { fetchSupplierHotels } = (0, workflow_1.proxyActivities)({
    startToCloseTimeout: "5 seconds",
    retry: {
        maximumAttempts: 3,
        initialInterval: "1 second",
        backoffCoefficient: 2,
    },
});
async function hotelSearchWorkflow(request) {
    const results = await Promise.allSettled([
        fetchSupplierHotels("A", request),
        fetchSupplierHotels("B", request),
    ]);
    const successfulResults = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
    if (successfulResults.length === 0) {
        throw workflow_1.ApplicationFailure.nonRetryable("Both suppliers failed");
    }
    const hotels = successfulResults.flatMap((result) => result.hotels.map((hotel) => ({
        ...hotel,
        supplier: result.supplier,
    })));
    if (hotels.length === 0) {
        throw workflow_1.ApplicationFailure.nonRetryable("No hotels found");
    }
    hotels.sort((a, b) => {
        if (a.price !== b.price) {
            return a.price - b.price;
        }
        // Deterministic tie-breaker:
        // Supplier A wins when prices are equal.
        return a.supplier === "A" ? -1 : 1;
    });
    return hotels[0];
}
