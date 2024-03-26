import { APIGatewayEvent } from "aws-lambda";
import { UpdateTodoDto } from "../../dtos";
import { updateTodoService } from "../../services/todos/update_todo.service";
import { getUserIdFromJwt } from "../../utils/get_user_id_from_jwt";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const userId = await getUserIdFromJwt(event);
    if (userId === "") {
      return {
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
    const body = JSON.parse(event.body || "{}");
    const parsedBody = body as UpdateTodoDto;
    await updateTodoService(todoId, parsedBody);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Todo updated successfully",
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Error updating todo",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
