import {
  DeleteCommand,
  GetCommand,
  GetCommandOutput,
  PutCommand,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { CreateUserDto, TodoStatus } from "../dtos";
import {
  IS_OFFLINE,
  LOCALSTACK_HOST,
  TODO_TABLE,
  USER_TABLE,
} from "../constants";
import { TodoPropsObj } from "../entities/todo.entity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as c from "node:crypto";
const dynamodbConfig = {
  region: "us-east-1",
};

const isLocal = IS_OFFLINE === "true";

if (isLocal) {
  const host = LOCALSTACK_HOST || "localhost";
  dynamodbConfig["endpoint"] = `http://${host}:4566`;
}

const client = new DynamoDBClient(dynamodbConfig);

export const DYNAMODB = {
  getUserById: async (userId: string): Promise<GetCommandOutput> => {
    const command = new GetCommand({
      TableName: USER_TABLE,
      Key: {
        id: userId,
      },
    });
    const response = await client.send(command);
    return response;
  },

  getUserByEmail: async (user_email: string) => {
    const command = new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": user_email,
      },
    });
    const response = await client.send(command);
    return response;
  },

  createUser: async (user: CreateUserDto) => {
    const command = new PutCommand({
      TableName: USER_TABLE,
      Item: {
        id: c.randomUUID(),
        ...user,
      },
    });
    const response = await client.send(command);
    return response;
  },

  getAllUsers: async () => {
    const command = new ScanCommand({
      TableName: USER_TABLE,
    });
    const response = await client.send(command);
    return response;
  },

  createTodo: async (todo: TodoPropsObj, userId: string) => {
    const command = new PutCommand({
      TableName: TODO_TABLE,
      Item: {
        ...todo,
        userId: userId,
      },
    });
    const response = await client.send(command);
    return response;
  },

  getAllTodos: async (userId: string, status?: TodoStatus) => {
    const filterExpression =
      status !== undefined
        ? "#status = :status AND #user_id = :user_id"
        : "#user_id = :user_id";

    const expressionAttributeNames =
      status !== undefined
        ? {
            "#status": "status",
            "#user_id": "userId",
          }
        : {
            "#user_id": "userId",
          };

    const expressionAttributeValues =
      status !== undefined
        ? { ":status": status, ":user_id": userId }
        : { ":user_id": userId };

    const params = {
      TableName: TODO_TABLE,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    const command = new ScanCommand(params as any);
    const response = await client.send(command);
    return response;
  },

  updateTodo: async (todoId: string, todo: TodoPropsObj, userId: string) => {
    const command = new PutCommand({
      TableName: TODO_TABLE,
      Item: {
        ...todo,
        id: todoId,
        userId: userId,
      },
    });
    const response = await client.send(command);
    return response;
  },

  deleteTodo: async (todoId: string) => {
    const command = new DeleteCommand({
      TableName: TODO_TABLE,
      Key: {
        id: todoId,
      },
    });
    const response = await client.send(command);
    return response;
  },

  getTodoById: async (todoId: string): Promise<ScanCommandOutput> => {
    const command = new ScanCommand({
      TableName: TODO_TABLE,
      FilterExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id",
      },
      ExpressionAttributeValues: {
        ":id": todoId,
      },
    });
    const response = await client.send(command);
    return response;
  },
};
