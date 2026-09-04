import {
    proxyActivities,
    ApplicationFailure,
} from "@temporalio/workflow";

import type * as activities from "../activities/supplier.activities";

import {
    HotelSearchRequest,
    BestHotel,
    SupplierResult,
} from "../types/hotel";

const { fetchSupplierHotels } = proxyActivities<typeof activities>({
    startToCloseTimeout: "5 seconds",

    retry: {
        maximumAttempts: 3,
        initialInterval: "1 second",
        backoffCoefficient: 2,
    },
});

export async function hotelSearchWorkflow(
    request: HotelSearchRequest
): Promise<BestHotel> {
    const results = await Promise.allSettled([
        fetchSupplierHotels("A", request),
        fetchSupplierHotels("B", request),
    ]);

    const successfulResults: SupplierResult[] = results
        .filter(
            (result): result is PromiseFulfilledResult<SupplierResult> =>
                result.status === "fulfilled"
        )
        .map((result) => result.value);

    if (successfulResults.length === 0) {
        throw ApplicationFailure.nonRetryable(
            "Both suppliers failed"
        );
    }

    const hotels = successfulResults.flatMap(
        (result) =>
            result.hotels.map((hotel) => ({
                ...hotel,
                supplier: result.supplier,
            }))
    );

    if (hotels.length === 0) {
        throw ApplicationFailure.nonRetryable(
            "No hotels found"
        );
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