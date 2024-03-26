import { TodoStatus } from "../dtos";
import { Entity } from "./entity";

export class Todo extends Entity<TodoProps, TodoPropsObj> {
  constructor(props: TodoProps, id?: string) {
    super(props, id);
  }

  toObject(): TodoPropsObj {
    return {
      id: this.id,
      ...this.props,
      created_at: this.props.created_at.toISOString(),
    };
  }
}

export type TodoProps = {
  title: string;
  description: string;
  status: TodoStatus;
  created_at: Date;
  userId: string;
};

export type TodoPropsObj = {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  created_at: string;
};
