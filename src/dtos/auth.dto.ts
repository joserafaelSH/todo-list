export type AuthDto = {
  email: string;
  password: string;
};

export type AuthResponseDto = {
  statusCode: number;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
