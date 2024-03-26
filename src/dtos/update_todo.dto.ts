export type UpdateTodoDto = {
  title: string;
  description: string;
  status: TodoStatus;
};

export type TodoStatus = "PENDING" | "DONE";
