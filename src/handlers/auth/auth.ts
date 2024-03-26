import { APIGatewayEvent } from "aws-lambda";
import { AuthDto } from "../../dtos";
import { authService } from "../../services/auth/auth.service";

export const handler = async (event: APIGatewayEvent) => {
  const body = JSON.parse(event.body || "{}");

  try {
    const parsedBody = body as AuthDto;

    const response = await authService(parsedBody);

    return {
      statusCode: response.statusCode,
      body: JSON.stringify(
        {
          data: response,
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
          message: "Error while authenticating user",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
};
