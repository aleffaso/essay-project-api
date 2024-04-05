import { AppDataSource } from "../../data-source";

import { Essay as EssayTable } from "../../entities/Essay";
import { DoesNotExistError } from "../../errors";

export class DeleteEssayService {
  async execute({ id }: EssayId) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = await essayRepo.findOne({ where: { id } });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      return await essayRepo.delete({ id });
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
