import { Connection, WorkflowClient } from "@temporalio/client";

export async function getTemporalClient() {
    const connection = await Connection.connect({
        address: "localhost:7233",
    });

    return new WorkflowClient({
        connection,
    });
}