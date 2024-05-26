import "dotenv/config";

export const KEYS = {
  PORT: Number(process.env.PORT as string) ?? undefined,
  POSTGRES: {
    NAME: (process.env.POSTGRES_NAME as string) ?? "",
    NEW_NAME: (process.env.NEW_POSTGRES_NAME as string) ?? "",
    PASSWORD: (process.env.POSTGRES_PASSWORD as string) ?? "",
    USER: (process.env.POSTGRES_USER as string) ?? "",
    DB: (process.env.POSTGRES_DB as string) ?? "",
  },
  ORM_CONFIG: {
    DB: (process.env.ORM_CONFIG_DB as string) ?? "",
    USERNAME: (process.env.ORM_CONFIG_USERNAME as string) ?? "",
    PASSWORD: (process.env.ORM_CONFIG_PASSWORD as string) ?? "",
    HOST: (process.env.ORM_CONFIG_HOST as string) ?? "",
    PORT: Number(process.env.ORM_CONFIG_PORT as string) ?? undefined,
  },
  ADMIN: {
    FIRSTNAME: (process.env.ADMIN_FIRSTNAME as string) ?? "",
    LASTNAME: (process.env.ADMIN_LASTNAME as string) ?? "",
    EMAIL: (process.env.ADMIN_EMAIL as string) ?? "",
    PASSWORD: (process.env.ADMIN_PASSWORD as string) ?? "",
    PERMISSION: (process.env.ADMIN as string) ?? "",
  },
  JWT: {
    USER: (process.env.JWT_KEY_TOKEN_USER as string) ?? "",
    TOKEN_EXPIRES_IN: (process.env.JWT_TOKEN_EXPIRES_IN as string) ?? "1d",
  },
};

export const PERMISSION_LEVELS = {
  ADMIN: (process.env.ADMIN as string) ?? "ADMIN",
  USER: (process.env.USER as string) ?? "USER",
  CUSTOMER: (process.env.CUSTOMER as string) ?? "CUSTOMER",
  FINANCIAL: (process.env.FINANCIAL as string) ?? "FINANCIAL",
  SUPPORT: (process.env.SUPPORT as string) ?? "SUPPORT",
  DEVELOPER: (process.env.DEVELOPER as string) ?? "DEVELOPER",
};
