import { DYNAMODB } from "../../database";

export const deleteTodoService = async (todoId: string): Promise<void> => {
  try {
    await DYNAMODB.deleteTodo(todoId);
  } catch (error) {
    throw new Error(error.message);
  }
};
