import { NativeConnection, Worker } from "@temporalio/worker";
import * as activities from "../activities/supplier.activities";

async function run() {
    const connection = await NativeConnection.connect({
        address:
            process.env.TEMPORAL_ADDRESS || "localhost:7233",
    });

    const worker = await Worker.create({
        connection,
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