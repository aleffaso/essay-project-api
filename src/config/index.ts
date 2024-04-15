import { AppDataSource } from "../data-source";
import { PermissionType } from "../entities/user/Enum";
import { UserPermission as UserPermissionTable } from "../entities/user/UserPermission";

export async function createUserPermissions(): Promise<void> {
  const userPermissionRepo = AppDataSource.getRepository(UserPermissionTable);

  const permissionTypes: PermissionType[] = [
    PermissionType.ADMIN,
    PermissionType.USER,
    PermissionType.CUSTOMER,
    PermissionType.FINANCIAL,
    PermissionType.SUPPORT,
    PermissionType.DEVELOPER,
  ];

  for (const permissionType of permissionTypes) {
    try {
      await userPermissionRepo.query(
        `INSERT INTO UserPermission (type) VALUES ('${permissionType}')`
      );
      console.log(`Permission '${permissionType}' created successfully.`);
    } catch (error) {
      console.error(`Error creating permission '${permissionType}':`, error);
    }
  }
}
