import bcrypt from "bcrypt";

import { AppDataSource } from "../../data-source";
import { Student as StudentTable } from "../../entities/Student";
import { AlreadyExistsError } from "../../errors";
import { StudentCreatedObserver } from "./observers/EmailNotifier";

export class CreateStudentService {
  private readonly observer: StudentCreatedObserver;

  constructor(observer: StudentCreatedObserver) {
    this.observer = observer;
  }
  async execute({
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
  }: StudentCreate) {
    try {
      const studentRepo = AppDataSource.getRepository(StudentTable);
      const studentAlreadyExists = await studentRepo.findOne({
        where: { email },
      });

      if (studentAlreadyExists) {
        throw new AlreadyExistsError("Student already exists");
      }

      const student = studentRepo.create({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password as string, 10),
        phoneNumber,
        address,
        city,
        state,
        country,
        zipCode,
      });

      await studentRepo.save(student);

      this.observer.notify(student);

      const studentResponse: StudentResponse = {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        address: student.address,
        city: student.city,
        state: student.state,
        country: student.country,
        zipCode: student.zipCode,
      };

      return { student: studentResponse };
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        return {
          message: error.name,
          status_code: error.status(),
        };
      }
    }
  }
}
