import { defaultDelayDecider } from "@smithy/middleware-retry";
import { DYNAMODB } from "../../database";
import { Todo, TodoPropsObj } from "../../entities/todo.entity";

export const getTodoByIdService = async (
  todoId: string
): Promise<TodoPropsObj> => {
  const response = await DYNAMODB.getTodoById(todoId);

  if (!response || response.Item === undefined) {
    throw new Error("Error getting todo");
  }

  if (Object.keys(response.Item).length === 6) {
    const newTodo: Todo = new Todo(
      {
        title: response.Item.title,
        description: response.Item.description,
        status: response.Item.status,
        created_at: new Date(response.Item.created_at),
        userId: response.Item.userId,
      },
      response.Item.id
    );

    return newTodo.toObject();
  }

  throw new Error("Error getting todo");
};
