import { Request, Response } from "express";
import { CreateEssayService } from "../../service/essays/CreateEssayService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../../service/essays/observers/EmailNotifier";
import { UpdateEssayService } from "../../service/essays/UpdateEssayService";

const createEssayService = new CreateEssayService(new EmailCreationNotifier());
const updateEssayService = new UpdateEssayService(new EmailUpdateNotifier());

export default new (class UserController {
  async create(req: Request, res: Response) {
    const {
      title,
      author,
      text,
      uploadDate,
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
        uploadDate,
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
      const userRequest = await updateEssayService.execute({
        id,
        annotations,
        status,
        corrections,
        tags,
        comments,
      });

      return res.json(userRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }
})();
