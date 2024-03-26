import { APIGatewayEvent } from "aws-lambda";

import { deleteTodoService } from "../../services/todos/delete_todo.service";
import { getUserIdFromJwt } from "../../utils/get_user_id_from_jwt";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const userId = await getUserIdFromJwt(event);
    if (userId === "") {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 401,
        body: JSON.stringify(
          {
            message: "Unauthorized",
          },
          null,
          2
        ),
      };
    }

    const todoId = event.pathParameters?.id;

    if (!todoId) {
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: JSON.stringify(
          {
            message: "Todo ID is required",
          },
          null,
          2
        ),
      };
    }

    await deleteTodoService(todoId);

    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Todo deleted successfully",
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error deleting todo",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
