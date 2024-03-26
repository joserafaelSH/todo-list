import { DYNAMODB } from "../../database";
import { TodoStatus } from "../../dtos";
import { Todo, TodoPropsObj } from "../../entities/todo.entity";

export const getAllTodosService = async (
  userId: string,
  status?: TodoStatus
): Promise<TodoPropsObj[]> => {
  const response = await DYNAMODB.getAllTodos(userId, status);

  if (!response || response.Items === undefined) {
    throw new Error("Error getting todos");
  }

  const todos: TodoPropsObj[] = [];

  response.Items.forEach((todo) => {
    if (Object.keys(todo).length === 6) {
      const newTodo = new Todo(
        {
          title: todo.title,
          description: todo.description,
          status: todo.status,
          created_at: new Date(todo.created_at),
          userId: todo.userId,
        },
        todo.id
      );

      todos.push(newTodo.toObject());
    }
  });

  return todos;
};
