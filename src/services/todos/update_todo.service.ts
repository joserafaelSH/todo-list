import { DYNAMODB } from "../../database";
import { UpdateTodoDto } from "../../dtos";
import { Todo } from "../../entities/todo.entity";

export const updateTodoService = async (
  id: string,
  input: UpdateTodoDto
): Promise<void> => {
  try {
    const currentTodo = await DYNAMODB.getTodoById(id);
    if (!currentTodo || currentTodo.Count === 0 || !currentTodo.Items) {
      throw new Error("Todo not found");
    }

    if (input.status != "PENDING" && input.status != "DONE") {
      throw new Error("Invalid status");
    }

    const newTodo = new Todo(
      {
        created_at: new Date(currentTodo.Items[0].created_at),
        description: input.description,
        status: input.status,
        title: input.title,
        userId: currentTodo.Items[0].userId,
      },
      currentTodo.Items[0].id
    );

    await DYNAMODB.updateTodo(
      id,
      newTodo.toObject(),
      currentTodo.Items[0].userId
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
