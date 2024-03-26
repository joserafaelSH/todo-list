import { APIGatewayEvent } from "aws-lambda";
import { DYNAMODB } from "../../database";
import { CreateUserDto } from "../../dtos";

export const handler = async (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body || "{}");

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          message: "No body provided",
          input: event,
        },
        null,
        2
      ),
    };
  }

  try {
    const parsedBody = body as CreateUserDto;
    await DYNAMODB.createUser(parsedBody);

    return {
      statusCode: 201,
      body: JSON.stringify(
        {
          message: "User created successfully",
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
          message: "Error creating user",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
