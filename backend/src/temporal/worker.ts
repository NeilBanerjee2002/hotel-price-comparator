import { Worker } from "@temporalio/worker";
import * as activities from "../activities/supplier.activities";

async function run() {
    const worker = await Worker.create({
        workflowsPath: require.resolve("../workflows/hotelSearch.workflow"),
        activities,
        taskQueue: "hotel-search",
    });

    await worker.run();
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});