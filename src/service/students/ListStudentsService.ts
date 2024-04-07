import { AppDataSource } from "../../data-source";

import { Student as StudentTable } from "../../entities/Student";
import { DoesNotExistError } from "../../errors";

export class ListStudentsService {
  async execute(page: number, limit: number) {
    try {
      const userRepo = AppDataSource.getRepository(StudentTable);
      const offset = (page - 1) * limit;
      const students = await userRepo.find({
        skip: offset,
        take: limit,
      });

      if (!students || students.length === 0) {
        throw new DoesNotExistError("Students do not exist");
      }

      return { count: students.length, students };
    } catch (error) {
      if (error instanceof DoesNotExistError) {
        return {
          message: error.name,
          status_code: error.status(),
        };
      }
    }
  }
}
