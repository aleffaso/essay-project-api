import { KEYS, PERMISSION_LEVELS } from "../../constants";

export enum PermissionType {
  ADMIN = PERMISSION_LEVELS.ADMIN as any,
  USER = PERMISSION_LEVELS.USER as any,
  CUSTOMER = PERMISSION_LEVELS.CUSTOMER as any,
  FINANCIAL = PERMISSION_LEVELS.FINANCIAL as any,
  SUPPORT = PERMISSION_LEVELS.SUPPORT as any,
  DEVELOPER = PERMISSION_LEVELS.DEVELOPER as any,
}

export const superUser = {
  firstName: KEYS.ADMIN.FIRSTNAME,
  lastName: KEYS.ADMIN.LASTNAME,
  email: KEYS.ADMIN.EMAIL,
  password: KEYS.ADMIN.PASSWORD,
  isActive: true,
};
