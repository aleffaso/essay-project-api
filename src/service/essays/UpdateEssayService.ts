import { AppDataSource } from "../../data-source";
import { Essay as EssayTable } from "../../entities/Essay";
import { DoesNotExistError } from "../../errors";
import { EssayUpdatedObserver } from "./observers/EmailNotifier";

export class UpdateEssayService {
  private readonly observer: EssayUpdatedObserver;

  constructor(observer: EssayUpdatedObserver) {
    this.observer = observer;
  }
  async execute({
    id,
    annotations,
    status,
    corrections,
    tags,
    comments,
  }: essayUpdate) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = await essayRepo.findOne({ where: { id } });

      if (!essay) {
        throw new DoesNotExistError("User does not exist");
      }

      essayRepo.update(id as string, {
        annotations,
        status,
        corrections,
        tags,
        comments,
      });

      await essayRepo.save(essay);

      this.observer.notify(essay);

      const essayResponse: essayResponse = {
        id: essay.id,
        title: essay.title,
        author: essay.author,
        text: essay.text,
        uploadDate: essay.uploadDate,
        amazonLink: essay.amazonLink,
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
