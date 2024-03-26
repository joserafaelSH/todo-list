import { APIGatewayEvent } from "aws-lambda";
import { getAllTodosService } from "../../services/todos/get_all_todos.service";
import { getUserIdFromJwt } from "../../utils/get_user_id_from_jwt";
import { TodoStatus } from "../../dtos";

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

    let status = event.queryStringParameters?.status;
    if (status && status !== "PENDING" && status !== "DONE") {
      status = undefined;
    }

    const todos = await getAllTodosService(userId, status as TodoStatus);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: todos,
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
          message: "Error getting all todos",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
