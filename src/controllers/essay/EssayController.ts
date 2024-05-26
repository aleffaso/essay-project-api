import { Request, Response } from "express";
import { CreateEssayService } from "../../service/essays/CreateEssayService";
import { EmailEssayCreationNotifier } from "../../service/essays/observers/EmailNotifier";
import { DoesNotExistError, ForbiddenError } from "../../errors";

export default new (class EssayController {
  async create(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { specification, title, text, uploadedLink } = req.body;
    try {
      const createEssayService = new CreateEssayService(
        new EmailEssayCreationNotifier()
      );
      const essayRequest = await createEssayService.execute(authorization, {
        specification,
        title,
        text,
        uploadedLink,
      });

      return res.status(200).json(essayRequest);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }
})();
