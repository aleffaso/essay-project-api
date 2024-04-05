import { AppDataSource } from "../../data-source";

import { Essay as EssayTable } from "../../entities/Essay";
import { DoesNotExistError } from "../../errors";

export class ListEssaysService {
  async execute(page: number, limit: number) {
    try {
      const essayRepo = AppDataSource.getRepository(EssayTable);
      const offset = (page - 1) * limit;
      const essays = await essayRepo.find({
        skip: offset,
        take: limit,
      });

      if (!essays || essays.length === 0) {
        throw new DoesNotExistError("Essays do not exist");
      }

      return essays.length;
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
