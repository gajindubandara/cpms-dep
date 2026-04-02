import ddbDocClient from "../config/dynamodb.js";
import {Expense} from "../models/ExpenseModel.js";
import {DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";


//create expense
export const createExpense = async (data) =>{
    const item = Expense.create(data);

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: item
    };
    await  ddbDocClient.send(new PutCommand(params));
    return item;
}

//get expense
export const getExpenseById = async  (expenseId, type) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PK: Expense.pk(expenseId),
            SK: Expense.sk()
        }
    };
        const result = await ddbDocClient.send(new GetCommand(params));
        return result.Item;
}


export const getAllExpenses = async () => {
    const params = {
        TableName: process.env.TABLE_NAME,
        FilterExpression: "#sk = :skValue",
        ExpressionAttributeNames: {
            "#sk": "SK"
        },
        ExpressionAttributeValues: {
            ":skValue": "EXPENSE"
        }
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    return result.Items || [];
};

//delete expense
export const deleteExpense = async (expenseId) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PK: Expense.pk(expenseId),
            SK: Expense.sk()
        }
    }
    const result = ddbDocClient.send(new DeleteCommand(params));
    return result;
}

//update expense
export const updateExpense = async (expenseId, updates) => {
    updates.updatedAt = new Date().toISOString();

    const ExpressionAttributeNames = { "#attr": "Attributes" };
    const ExpressionAttributeValues = {};
    const updateParts = [];

    Object.keys(updates).forEach((key, index) => {
        const nameKey = `#key${index}`;
        const valueKey = `:val${index}`;

        updateParts.push(`#attr.${nameKey} = ${valueKey}`);
        ExpressionAttributeNames[nameKey] = key;
        ExpressionAttributeValues[valueKey] = updates[key];
    });

    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            PK: Expense.pk(expenseId),
            SK: Expense.sk(),
        },
        UpdateExpression: `SET ${updateParts.join(", ")}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
    };

    const result = await ddbDocClient.send(new UpdateCommand(params));
    return result.Attributes;
};

//expense by query daterange
export const getExpensesByDateRange = async (startDate, endDate) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        IndexName: "SK-index",
        KeyConditionExpression: "#sk = :sk",
        FilterExpression: "#queryDate BETWEEN :start AND :end",
        ExpressionAttributeNames: {
            "#sk": "SK",
            "#queryDate": "queryDate",
        },
        ExpressionAttributeValues: {
            ":sk": "EXPENSE",
            ":start": startDate,
            ":end": endDate,
        },
    };

    const result = await ddbDocClient.send(new QueryCommand(params));
    return result.Items || [];
};