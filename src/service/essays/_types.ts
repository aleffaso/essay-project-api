type Essay = {
  id: string;
  title: string;
  author: string;
  text: string;
  amazonLink?: string;
  annotations?: string;
  status?: string;
  corrections?: string;
  tags?: string;
  comments?: string;
};

type EssayCreate = Omit<Essay, "id">;

type EssayUpdate = Partial<
  Pick<Essay, "annotations" | "status" | "corrections" | "tags" | "comments">
> & {
  id: string;
};

type EssayId = {
  id: string;
};
