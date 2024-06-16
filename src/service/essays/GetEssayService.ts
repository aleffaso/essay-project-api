import { AppDataSource } from "../../data-source";
import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { EssayIdType, EssayType } from "./_types";
import { Essay as EssayTable } from "../../entities/essay/Essay";

export class GetEssayService {
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
        relations: ["author", "updates"],
      });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      const essayResponse: EssayType = {
        id: essay.id,
        tag: essay.tag,
        specification: essay.specification,
        title: essay.title,
        text: essay.text,
        uploadedLink: essay.uploadedLink,
        status: essay.status,
        author: {
          id: essay.author.id,
          firstName: essay.author.firstName,
          lastName: essay.author.lastName,
          email: essay.author.email,
          isActive: essay.author.isActive,
          permissions: essay.author.permissions,
          essays: essay.author.essays,
        },
        updatesCount: essay.updates.length,
        updates: essay.updates,
      };

      return { essay: essayResponse };
    } catch (error) {
      throw error;
    }
  }
}
