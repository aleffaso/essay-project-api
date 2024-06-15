import { AppDataSource } from "../../data-source";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { EssayIdType } from "./_types";
import { Essay as EssayTable } from "../../entities/essay/Essay";

export class DeleteEssayService {
  async execute(authorization: any, { id }: EssayIdType) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = await essayRepo.findOne({
        where: { id },
        relations: ["updates"],
      });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      return await essayRepo.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
