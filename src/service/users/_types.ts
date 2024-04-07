type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  admin?: boolean;
  is_active?: boolean;
};

type UserCreate = Omit<User, "id"> & {
  password: string;
};

type UserUpdate = Partial<User> & {
  password?: string;
};

type UserRequest = {
  email: string;
  password: string;
};

type UserResponse = Omit<User, "password">;

type UserId = {
  id: string;
};
