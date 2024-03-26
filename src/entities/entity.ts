import * as c from "node:crypto";

export abstract class Entity<Props, PropsObj> {
  protected props: Props;
  protected id: string;

  constructor(props: Props, id?: string) {
    this.props = props;
    this.id = id || c.randomUUID();
  }

  abstract toObject(): PropsObj;
}
