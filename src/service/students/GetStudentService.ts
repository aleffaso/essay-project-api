import { AppDataSource } from "../../data-source";

import { Student as StudentTable } from "../../entities/Student";
import { DoesNotExistError } from "../../errors";

export class GetStudentService {
  async execute({ id }: StudentId) {
    try {
      const studentRepo = AppDataSource.getRepository(StudentTable);

      const student = await studentRepo.findOne({ where: { id } });

      if (!student) {
        throw new DoesNotExistError("Student does not exist");
      }

      const studentResponse: Student = {
        id: id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        password: student.password,
        phoneNumber: student.phoneNumber,
        address: student.address,
        city: student.city,
        state: student.state,
        country: student.country,
        zipCode: student.zipCode,
      };

      return { student: studentResponse };
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
