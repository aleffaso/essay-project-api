import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { SpecificationType } from "../../entities/essay/Enum";
import {
  DoesNotExistError,
  ForbiddenError,
  InvalidDataError,
} from "../../errors";
import { isValidEnumValue } from "../../utils";
import { getPermissions } from "../PermissionsUserService";
import { EssayType, EssayIdType, EssayUpdateType, EssayUpdate } from "./_types";
import { Essay as EssayTable } from "../../entities/essay/Essay";
import { EssayUpdate as EssayUpdateTable } from "../../entities/essay/EssayUpdate";
import { User as UserTable } from "../../entities/user/User";
import { EssayUpdatedObserver } from "./observers/EmailNotifier";
import { KEYS } from "../../constants";

export class UpdateEssayService {
  private readonly observer: EssayUpdatedObserver;

  constructor(observer: EssayUpdatedObserver) {
    this.observer = observer;
  }

  async execute(
    authorization: any,
    {
      id: essayId,
      specification,
      title,
      text,
      uploadedLink,
      updates,
    }: EssayUpdateType & EssayIdType
  ) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      if (
        specification &&
        !isValidEnumValue(SpecificationType, specification)
      ) {
        throw new InvalidDataError(
          `Invalid specification type: ${specification}`
        );
      }

      const essayRepo = AppDataSource.getRepository(EssayTable);

      const essay = await essayRepo.findOne({
        where: { id: essayId },
        relations: ["author", "updates"],
      });

      if (!essay) {
        throw new DoesNotExistError("Essay does not exist");
      }

      if (specification) essay.specification = specification;
      if (title) essay.title = title;
      if (text) essay.text = text;
      if (uploadedLink) essay.uploadedLink = uploadedLink;

      await essayRepo.save(essay);

      const userRepo = AppDataSource.getRepository(UserTable);
      const { id } = jwt.verify(authorization, KEYS.JWT.USER) as TokenPayload;
      const user = await userRepo.findOne({
        where: { id },
        relations: ["permissions"],
      });

      if (!user) {
        throw new DoesNotExistError("User not found");
      }

      let newUpdates: any[] = [];
      const essayUpdatesRepo = AppDataSource.getRepository(EssayUpdateTable);

      if (updates && updates.length > 0) {
        newUpdates = await Promise.all(
          updates.map((update) =>
            essayUpdatesRepo.create({
              ...update,
              user,
              essay,
            })
          )
        );

        await Promise.all(
          newUpdates.map((update) => essayUpdatesRepo.save(update))
        );

        this.observer.notify(essay, user);
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
        updatesCount: newUpdates.length,
        updates: newUpdates?.map((update) => ({
          id: update.id,
          grade: update.grade,
          annotations: update.annotations,
          corrections: update.corrections,
          comments: update.comments,
          createdAt: update.createdAt,
          updatedAt: update.updatedAt,
        })),
      };

      return { essay: essayResponse };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new DoesNotExistError("Invalid token");
      }
      throw error;
    }
  }
}
