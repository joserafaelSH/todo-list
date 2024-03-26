import { APIGatewayEvent } from "aws-lambda";
import { validateJwtToken } from "../services/jwt/jwt.service";

export const getUserIdFromJwt = async (
  event: APIGatewayEvent
): Promise<string> => {
  const bearer = event.headers["authorization"];
  if (!bearer) {
    return "";
  }
  const token = bearer.split(" ")[1];
  const userId = await validateJwtToken(token);
  return userId;
};
