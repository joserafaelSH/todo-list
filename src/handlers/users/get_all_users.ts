import { APIGatewayEvent } from "aws-lambda";
import { DYNAMODB } from "../../database";
import { CreateUserDto } from "../../dtos";

export const handler = async (event: APIGatewayEvent) => {
  try {
    const response = await DYNAMODB.getAllUsers();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: response.Items,
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
