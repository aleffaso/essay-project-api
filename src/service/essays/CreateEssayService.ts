import jwt, { JsonWebTokenError } from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { User as UserTable } from "../../entities/user/User";
import { Essay as EssayTable } from "../../entities/essay/Essay";
import {
  DoesNotExistError,
  ForbiddenError,
  InvalidDataError,
} from "../../errors";
import { getPermissions } from "../PermissionsUserService";
import { EssayCreateType, EssayResponseType } from "./_types";
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
        updates: [],
        tags: [],
      });

      await essayRepo.save(essay);

      this.observer.notify(essay);

      const essayResponse: EssayResponseType = {
        id: essay.id,
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
        tags: essay.tags,
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
