import { DYNAMODB } from "../../database";
import { Todo, TodoPropsObj } from "../../entities/todo.entity";

export const getTodoByIdService = async (
  todoId: string
): Promise<TodoPropsObj> => {
  const response = await DYNAMODB.getTodoById(todoId);

  if (!response || response.Count === 0 || !response.Items) {
    throw new Error("Error getting todo");
  }

  if (Object.keys(response.Items[0]).length === 6) {
    const newTodo: Todo = new Todo(
      {
        title: response.Items[0].title,
        description: response.Items[0].description,
        status: response.Items[0].status,
        created_at: new Date(response.Items[0].created_at),
        userId: response.Items[0].userId,
      },
      response.Items[0].id
    );

    return newTodo.toObject();
  }

  throw new Error("Error getting todo");
};
