type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type StudentCreate = Omit<Student, "id"> & {
  password: string;
};

type StudentUpdate = Partial<Student> & {
  password?: string;
};

type StudentRequest = {
  email: string;
  password: string;
};

type StudentId = {
  id: string;
};

type StudentResponseBase = Omit<Student, "password">;

type ExtendedStudentResponse = StudentResponseBase & {
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type StudentResponse = StudentResponseBase | ExtendedStudentResponse;

type UserJWTToken = {
  id?: string;
  expiresIn?: number;
  userId?: string;
  refresh_token?: string;
  token?: string;
};

type JWTTokenPayload<T extends string | undefined> = {
  userId: T;
  refresh_token?: string;
};

type JWTTokenResponse<T extends string | undefined> = Omit<
  UserJWTToken,
  "id" | "expiresIn" | "userId"
>;

type JWTTokenRequest = {
  refresh_token?: string;
};
