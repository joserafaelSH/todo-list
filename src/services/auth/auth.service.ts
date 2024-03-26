import { DYNAMODB } from "../../database";
import { AuthDto, AuthResponseDto } from "../../dtos";
import { createJwtToken } from "../jwt/jwt.service";

export const authService = async (input: AuthDto): Promise<AuthResponseDto> => {
  const { email, password } = input;

  const getUser = await DYNAMODB.getUserByEmail(email);

  if (!getUser || getUser.Items === undefined) {
    throw new Error("Internal server error");
  }

  if (getUser.Count === 0) {
    const response: AuthResponseDto = {
      statusCode: 404,
      token: "",
      user: {
        id: "",
        name: "",
        email: "",
      },
    };
    return response;
  }

  const user = getUser.Items[0];

  const passwordMatch = user.password === password;

  if (!passwordMatch) {
    const response: AuthResponseDto = {
      statusCode: 401,
      token: "",
      user: {
        id: "",
        name: "",
        email: "",
      },
    };
    return Promise.resolve(response);
  }

  const jwtToken = createJwtToken(user.id);

  const response: AuthResponseDto = {
    statusCode: 200,
    token: jwtToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };

  return response;
};
