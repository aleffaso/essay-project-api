type Essay = {
  id: string;
  title: string;
  author: string;
  text: string;
  amazonLink?: string;
  status?: string;
  tags?: string;
};

type EssayCreate = Omit<Essay, "id" | "created_at" | "updated_at">;

type EssayUpdate = Partial<
  Pick<Essay, "title" | "text" | "amazonLink" | "tags">
> & {
  id: string;
};

type EssayId = {
  id: string;
};
