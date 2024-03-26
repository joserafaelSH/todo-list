import { DYNAMODB } from "../../database";
import { CreateTodoDto } from "../../dtos";
import { Todo } from "../../entities/todo.entity";

export const createTodoService = async (
  input: CreateTodoDto,
  userId: string
): Promise<void> => {
  try {
    const todo = new Todo({
      created_at: new Date(),
      description: input.description,
      status: "PENDING",
      title: input.title,
      userId: userId,
    });

    await DYNAMODB.createTodo(todo.toObject(), userId);
  } catch (error) {
    throw new Error(error.message);
  }
};
