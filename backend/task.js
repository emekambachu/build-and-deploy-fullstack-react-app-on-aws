import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand,} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({region: "us-east-1"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchTasks = async () => {
    const command = new ScanCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "id, #name, completed",
        TableName: "Tasks",
    });

    return await docClient.send(command);
}

export const createTask = async ({name, completed}) => {
    const uuid = crypto.randomUUID();
    const command = new PutCommand({
        TableName: "Tasks",
        Item: {
            id: uuid,
            name,
            completed
        }
    });

    return await docClient.send(command);
}

export const updateTask = async ({id, name, completed}) => {
    const command = new UpdateCommand({
        TableName: "Tasks",
        Key: {id},
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
}

export const deleteTask = async (id) => {
    const command = new DeleteCommand({
        TableName: "Tasks",
        Key: {id},
    });
    return await docClient.send(command);
}