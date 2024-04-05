import { AppDataSource } from "../../data-source";

import { Essay as EssayTable } from "../../entities/Essay";
import { DoesNotExistError } from "../../errors";

export class GetEssayService {
  async execute({ id }: EssayId) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);

      const essay = await essayRepo.findOne({ where: { id } });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      const essayResponse: Essay = {
        id: id,
        title: essay.title,
        author: essay.author,
        text: essay.text,
        amazonLink: essay.amazonLink,
        annotations: essay.annotations,
        status: essay.status,
        corrections: essay.corrections,
        tags: essay.tags,
        comments: essay.comments,
      };

      return { essay: essayResponse };
    } catch (error) {
      if (error instanceof DoesNotExistError) {
        return {
          message: error.name,
          status_code: error.status(),
        };
      }
    }
  }
}
