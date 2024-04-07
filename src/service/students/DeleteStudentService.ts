import { AppDataSource } from "../../data-source";

import { Student as StudentTable } from "../../entities/Student";
import { DoesNotExistError } from "../../errors";

export class DeleteStudentService {
  async execute({ id }: StudentId) {
    try {
      const studentRepo = AppDataSource.getRepository(StudentTable);
      const student = await studentRepo.findOne({ where: { id } });

      if (!student) {
        throw new DoesNotExistError("Student does not exist");
      }

      return await studentRepo.delete({ id });
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
