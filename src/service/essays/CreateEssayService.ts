import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/user/User";
import { Essay as EssayTable } from "../../entities/essay/Essay";
import { EssayUpdate as EssayUpdateTable } from "../../entities/essay/EssayUpdate";

import {
  DoesNotExistError,
  ForbiddenError,
  InvalidDataError,
} from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { EssayType, EssayCreateType } from "./_types";
import { EssayCreatedObserver } from "./observers/EmailNotifier";
import { KEYS } from "../../constants";
import { SpecificationType, StatusType } from "../../entities/essay/Enum";
import { isValidEnumValue } from "../../utils";

export class CreateEssayService {
  private readonly observer: EssayCreatedObserver;

  constructor(observer: EssayCreatedObserver) {
    this.observer = observer;
  }

  async execute(
    authorization: any,
    { specification, title, text, uploadedLink }: EssayCreateType
  ) {
    try {
      const permissionsResult = await getPermissions(
        authorization,
        this.constructor.name
      );

      if (!permissionsResult.hasPermissions) {
        throw new ForbiddenError("You do not have permission");
      }

      if (!isValidEnumValue(SpecificationType, specification)) {
        throw new InvalidDataError(
          `Invalid specification type: ${specification}`
        );
      }

      const userRepo = AppDataSource.getRepository(UserTable);
      const { id } = jwt.verify(authorization, KEYS.JWT.USER) as TokenPayload;
      const user = await userRepo.findOne({
        where: { id },
        relations: ["permissions"],
      });

      if (!user) {
        throw new DoesNotExistError("User does not exist");
      }

      const essayRepo = AppDataSource.getRepository(EssayTable);
      const essay = essayRepo.create({
        specification,
        title,
        text,
        uploadedLink,
        status: StatusType.PENDING,
        author: user,
      });

      await essayRepo.save(essay);

      const essayUpdatesRepo = AppDataSource.getRepository(EssayUpdateTable);
      const updates = essayUpdatesRepo.create({
        grade: undefined,
        annotations: StatusType.PENDING,
        corrections: StatusType.PENDING,
        comments: StatusType.PENDING,
        user: user,
        essay: essay,
      });

      await essayUpdatesRepo.save(updates);

      this.observer.notify(essay);

      const savedEssay = await essayRepo.findOne({
        where: { id: essay.id },
        relations: ["author", "updates"],
      });

      if (!savedEssay) {
        throw new DoesNotExistError("Essay could not be found after creating");
      }

      const essayResponse: EssayType = {
        id: savedEssay.id,
        tag: savedEssay.tag,
        specification: savedEssay.specification,
        title: savedEssay.title,
        text: savedEssay.text,
        uploadedLink: savedEssay.uploadedLink,
        status: savedEssay.status,
        author: {
          id: savedEssay.author.id,
          firstName: savedEssay.author.firstName,
          lastName: savedEssay.author.lastName,
          email: savedEssay.author.email,
          isActive: savedEssay.author.isActive,
          permissions: savedEssay.author.permissions,
          essays: savedEssay.author.essays,
        },
        updates: savedEssay.updates,
      };

      return { essay: essayResponse };
    } catch (error) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        throw new DoesNotExistError("Invalid token");
      }
      throw error;
    }
  }
}
