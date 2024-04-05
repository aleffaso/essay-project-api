import { AppDataSource } from "../../data-source";

import { Essay as EssayTable } from "../../entities/Essay";
import { EssayCreatedObserver } from "./observers/EmailNotifier";

export class CreateEssayService {
  private readonly observer: EssayCreatedObserver;

  constructor(observer: EssayCreatedObserver) {
    this.observer = observer;
  }
  async execute({
    title,
    author,
    text,
    amazonLink,
    annotations,
    status,
    corrections,
    tags,
    comments,
  }: EssayCreate) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = essayRepo.create({
        title,
        author,
        text,
        amazonLink,
        annotations,
        status,
        corrections,
        tags,
        comments,
      });

      await essayRepo.save(essay);

      this.observer.notify(essay);

      const essayResponse: Essay = {
        id: essay.id,
        title: title,
        author: author,
        text: text,
        amazonLink: amazonLink,
        annotations: annotations,
        status: status,
        corrections: corrections,
        tags: tags,
        comments: comments,
      };

      return { essay: essayResponse };
    } catch (error) {
      return error ? error : undefined;
    }
  }
}
