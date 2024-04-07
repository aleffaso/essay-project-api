import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../../data-source";
import { Student as StudentTable } from "../../entities/Student";
import { KEYS } from "../../constants";
import { DoesNotExistError } from "../../errors";

class AuthenticateStudentService {
  async execute({ email, password }: StudentRequest) {
    try {
      const studentRepo = AppDataSource.getRepository(StudentTable);
      const student = await studentRepo.findOne({
        where: { email },
        select: ["firstName", "lastName", "email", "password"],
      });

      if (!student) {
        throw new DoesNotExistError("Data does not match");
      }

      const isValidPassword = await bcrypt.compare(
        password as string,
        student.password
      );

      if (!isValidPassword) {
        throw new DoesNotExistError("Data does not match");
      }

      const studentResponse: StudentResponse = {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: email,
      } as StudentResponse;

      const token = jwt.sign({ id: student.id }, KEYS.JWT.STUDENT, {
        expiresIn: KEYS.JWT.TOKEN_EXPIRES_IN,
      });

      return {
        student: studentResponse,
        token,
      };
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

export { AuthenticateStudentService };
