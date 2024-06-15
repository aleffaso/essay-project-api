import { DoesNotExistError, ForbiddenError } from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { Essay as EssayTable } from "../../entities/essay/Essay";
import { AppDataSource } from "../../data-source";
import { EssayType } from "./_types";

export class ListEssaysService {
  async execute(authorization: any, page: number, limit: number) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );
      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      const essayRepo = AppDataSource.getRepository(EssayTable);

      const offset = (page - 1) * limit;
      const essays = await essayRepo.find({
        skip: offset,
        take: limit,
        relations: ["author", "updates"],
      });

      if (!essays || essays.length === 0) {
        throw new DoesNotExistError("Essays do not exist");
      }

      const essayResponse: EssayType[] = essays.map((essay) => ({
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
        updates: essay.updates,
      }));

      return { count: essayResponse.length, essays: essayResponse };
    } catch (error) {}
  }
}
