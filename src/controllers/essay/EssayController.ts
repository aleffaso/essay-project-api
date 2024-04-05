import { Request, Response } from "express";
import { CreateEssayService } from "../../service/essays/CreateEssayService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../../service/essays/observers/EmailNotifier";
import { UpdateEssayService } from "../../service/essays/UpdateEssayService";
import { ListEssaysService } from "../../service/essays/ListEssaysService";
import { DeleteEssayService } from "../../service/essays/DeleteEssayService";

const createEssayService = new CreateEssayService(new EmailCreationNotifier());
const updateEssayService = new UpdateEssayService(new EmailUpdateNotifier());

export default new (class EssayController {
  async create(req: Request, res: Response) {
    const {
      title,
      author,
      text,
      amazonLink,
      annotations,
      status,
      corrections,
      tags,
      comments,
    } = req.body;
    try {
      const essayRequest = await createEssayService.execute({
        title,
        author,
        text,
        amazonLink,
        annotations,
        status,
        corrections,
        tags,
        comments,
      });

      return res.json(essayRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { annotations, status, corrections, tags, comments } = req.body;
    try {
      const essayRequest = await updateEssayService.execute({
        id,
        annotations,
        status,
        corrections,
        tags,
        comments,
      });

      return res.json(essayRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listEssaysService = new ListEssaysService();

      const essays = await listEssaysService.execute(parsedPage, parsedLimit);

      return res.json(essays);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleteEssayService = new DeleteEssayService();

      await deleteEssayService.execute({
        id,
      });

      return res.status(200).json({
        message: "Deleted successfully",
      });
    } catch (error) {
      res.json({ error: error });
    }
  }
})();
