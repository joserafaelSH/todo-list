import { APIGatewayEvent } from "aws-lambda";
import { CreateTodoDto } from "../../dtos";
import { createTodoService } from "../../services/todos/create_todo.service";
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

    const body = JSON.parse(event.body || "{}");
    const parsedBody = body as CreateTodoDto;
    await createTodoService(parsedBody, userId);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Todo created successfully",
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
          message: "Error creating todo",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
