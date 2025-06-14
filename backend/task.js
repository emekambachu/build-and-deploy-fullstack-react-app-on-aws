import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchTasks = async () => {
    const command = new ScanCommand({
        TableName: "Tasks",
    });
    console.log("Executing ScanCommand:", command);
    const response = await docClient.send(command);
    console.log("Scan response:", response);
    return { items: response.Items };
};

export const createTask = async ({ name, completed }) => {

    console.log("Task name from frontend", name);

    const uuid = crypto.randomUUID();
    const command = new PutCommand({
        TableName: "Tasks",
        Item: {
            id: uuid,
            name,
            completed
        }
    });
    console.log("Executing PutCommand with Item:", { id: uuid, name, completed });
    const response = await docClient.send(command);
    console.log("PutCommand response:", response);
    return response; // Return the response for debugging
};

export const updateTask = async ({ id, name, completed }) => {
    const command = new UpdateCommand({
        TableName: "Tasks",
        Key: { id },
        ExpressionAttributeNames: {
            "#name": "name",
        },
        UpdateExpression: "SET #name = :n, completed = :c",
        ExpressionAttributeValues: {
            ":n": name,
            ":c": completed
        },
        ReturnValues: "ALL_NEW"
    });
    return await docClient.send(command);
};

export const deleteTask = async (id) => {
    const command = DeleteCommand({
        TableName: "Tasks",
        Key: { id },
    });
    return await docClient.send(command);
};