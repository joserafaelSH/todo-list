import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../constants";
import { DYNAMODB } from "../../database";

export const createJwtToken = (userId: string): string => {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
};

export const validateJwtToken = async (token: string): Promise<string> => {
  try {
    const response = jwt.verify(token, JWT_SECRET);
    const { userId } = response as {
      userId: string;
      iat: number;
      exp: number;
    };

    const getUser = await DYNAMODB.getUserById(userId);
    if (!getUser || getUser.Item === undefined) {
      return "";
    }
    return userId;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
