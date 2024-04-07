import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { Student as StudentTable } from "../../entities/Student";
import { DoesNotExistError } from "../../errors";
import { StudentUpdatedObserver } from "./observers/EmailNotifier";

export class UpdateStudentService {
  private readonly observer: StudentUpdatedObserver;

  constructor(observer: StudentUpdatedObserver) {
    this.observer = observer;
  }

  async execute({
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
  }: StudentUpdate) {
    try {
      const studentRepo = AppDataSource.getRepository(StudentTable);
      const student = await studentRepo.findOne({
        where: { id },
        select: [
          "firstName",
          "lastName",
          "email",
          "password",
          "phoneNumber",
          "address",
          "city",
          "state",
          "country",
          "zipCode",
        ],
      });

      if (!student) {
        throw new DoesNotExistError("Student does not exist");
      }

      studentRepo.update(id as string, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: bcrypt.hashSync(password as string, 8),
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        state: state,
        country: country,
        zipCode: zipCode,
      });

      const StudentResponse: StudentUpdate = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        address: address,
        city: city,
        state: state,
        country: country,
        zipCode: zipCode,
      };

      if (
        password &&
        !(await bcrypt.compare(password.trim() as string, student.password))
      ) {
        this.observer.notify(student);
      }

      return { Student: StudentResponse };
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
