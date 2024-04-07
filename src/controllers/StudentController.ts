import { Request, Response } from "express";
import { CreateStudentService } from "../service/students/CreateStudentService";
import {
  EmailCreationNotifier,
  EmailUpdateNotifier,
} from "../service/students/observers/EmailNotifier";
import { UpdateStudentService } from "../service/students/UpdateStudentService";
import { ListStudentsService } from "../service/students/ListStudentsService";
import { GetStudentService } from "../service/students/GetStudentService";
import { AuthenticateStudentService } from "../service/students/AuthenticateStudentService";
import { DeleteStudentService } from "../service/students/DeleteStudentService";

const createStudentService = new CreateStudentService(
  new EmailCreationNotifier()
);
const updateStudentService = new UpdateStudentService(
  new EmailUpdateNotifier()
);

export default new (class StudentController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const authenticateStudentService = new AuthenticateStudentService();

      const authenticate = await authenticateStudentService.execute({
        email,
        password,
      });

      return res.json(authenticate);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async create(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      city,
      state,
      country,
      zipCode,
    } = req.body;
    try {
      const studentRequest = await createStudentService.execute({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        city,
        state,
        country,
        zipCode,
      });

      return res.json(studentRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      address,
      city,
      state,
      country,
      zipCode,
    } = req.body;
    try {
      const studentRequest = await updateStudentService.execute({
        id,
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        address,
        city,
        state,
        country,
        zipCode,
      });

      return res.json(studentRequest);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const getStudentService = new GetStudentService();

      const student = await getStudentService.execute({ id });

      return res.json(student);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page as string);
      const parsedLimit = parseInt(limit as string);

      const listStudentsService = new ListStudentsService();

      const StudentS = await listStudentsService.execute(
        parsedPage,
        parsedLimit
      );

      return res.json(StudentS);
    } catch (error) {
      res.json({ error: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleteStudentService = new DeleteStudentService();

      await deleteStudentService.execute({
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
