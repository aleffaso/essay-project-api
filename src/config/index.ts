import bcrypt from "bcrypt";

import { AppDataSource } from "../data-source";
import { PermissionType, superUser } from "../entities/user/Enum";
import { UserPermission as UserPermissionTable } from "../entities/user/UserPermission";
import { User as UserTable } from "../entities/user/User";
import { KEYS } from "../constants";

const handleCommand = async (command: string) => {
  switch (command) {
    case "CreateUserPermissions":
      await createUserPermissions();
      break;
    case "CreateSuperUser":
      await createSuperUser();
      break;
    default:
      console.log("Unknown command");
  }
};

if (process.argv.length > 2) {
  const command = process.argv[2];
  handleCommand(command);
} else {
  console.log("No command provided");
}

export async function createUserPermissions(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized");

    if (!AppDataSource.isInitialized) {
      throw new Error("Data Source initialization failed");
    }

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
        const newPermission = userPermissionRepo.create({
          type: permissionType,
        } as any);
        await userPermissionRepo.save(newPermission);
        console.log(`Permission '${permissionType}' created successfully.`);
      } catch (error) {
        console.error(`Error creating permission '${permissionType}':`, error);
      }
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function createSuperUser(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized");

    if (!AppDataSource.isInitialized) {
      throw new Error("Data Source initialization failed");
    }

    const userRepo = AppDataSource.getRepository(UserTable);

    const user = {
      ...superUser,
      password: bcrypt.hashSync(KEYS.ADMIN.PASSWORD, 10),
    };

    try {
      const createSuperUser = userRepo.create(user);

      const superUserPermission = KEYS.ADMIN.PERMISSION;

      const userPermissionRepo =
        AppDataSource.getRepository(UserPermissionTable);
      const userPermissions = await userPermissionRepo.find({
        where: { type: superUserPermission },
      });

      createSuperUser.permissions = userPermissions;

      await userRepo.save(createSuperUser);
      console.log(`Super user created successfully.`);
    } catch (error) {
      console.error(`Error creating permission super user:`, error);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
