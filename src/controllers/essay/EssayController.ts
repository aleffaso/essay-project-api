import { Request, Response } from "express";
import {
  EmailEssayCreationNotifier,
  EmailEssayUpdateNotifier,
} from "../../service/essays/observers/EmailNotifier";
import {
  DoesNotExistError,
  ForbiddenError,
  InvalidDataError,
} from "../../errors";
import { CreateEssayService } from "../../service/essays/CreateEssayService";
import { UpdateEssayService } from "../../service/essays/UpdateEssayService";
import { GetEssayService } from "../../service/essays/GetEssayService";
import { ListEssaysService } from "../../service/essays/ListEssaysService";
import { DeleteEssayService } from "../../service/essays/DeleteEssayService";

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

  async update(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { id } = req.params;
    const { specification, title, text, uploadedLink, updates } = req.body;
    try {
      const updateEssayService = new UpdateEssayService(
        new EmailEssayUpdateNotifier()
      );

      const essayRequest = await updateEssayService.execute(authorization, {
        id,
        specification,
        title,
        text,
        uploadedLink,
        updates,
      });

      return res.status(200).json(essayRequest);
    } catch (error) {
      if (
        error instanceof ForbiddenError ||
        error instanceof DoesNotExistError ||
        error instanceof InvalidDataError
      ) {
        const { statusCode, statusMessage } = error;
        return res.status(statusCode).json({ error: statusMessage });
      }
      return res
        .status(500)
        .json({ error: error, message: "Internal Server Error" });
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const authorization = req.headers.authorization;
      const getEssayService = new GetEssayService();

      const essay = await getEssayService.execute(authorization, { id });

      return res.status(200).json(essay);
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

  async list(req: Request, res: Response) {
    try {
      const authorization = req.headers.authorization;
      const { page, limit } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listEssaysService = new ListEssaysService();

      const essays = await listEssaysService.execute(
        authorization,
        parsedPage,
        parsedLimit
      );

      return res.status(200).json(essays);
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

  async delete(req: Request, res: Response) {
    const authorization = req.headers.authorization;
    const { id } = req.params;
    try {
      const deleteEssayService = new DeleteEssayService();

      await deleteEssayService.execute(authorization, {
        id,
      });

      return res.status(200).json({
        message: "Deleted successfully",
      });
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
