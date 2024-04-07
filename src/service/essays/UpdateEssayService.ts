import { AppDataSource } from "../../data-source";
import { Essay as EssayTable } from "../../entities/Essay";
import { DoesNotExistError } from "../../errors";
import { EssayUpdatedObserver } from "./observers/EmailNotifier";

export class UpdateEssayService {
  private readonly observer: EssayUpdatedObserver;

  constructor(observer: EssayUpdatedObserver) {
    this.observer = observer;
  }
  async execute({ id, title, text, amazonLink, tags }: EssayUpdate) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = await essayRepo.findOne({ where: { id } });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      essayRepo.update(id as string, {
        title,
        text,
        amazonLink,
        tags,
      });

      await essayRepo.save(essay);

      this.observer.notify(essay);

      const essayResponse: Essay = {
        id: essay.id,
        title: essay.title,
        author: essay.author,
        text: essay.text,
        amazonLink: essay.amazonLink,
        status: essay.status,
        tags: essay.tags,
      };

      return { essay: essayResponse };
    } catch (error) {
      return error ? error : undefined;
    }
  }
}
