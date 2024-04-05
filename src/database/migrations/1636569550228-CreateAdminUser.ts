import { MigrationInterface, QueryRunner, getManager } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../../entities/User";
import { KEYS } from "../../constants";

export class CreateAdminUser1636569550228 implements MigrationInterface {
  name = "CreateAdminUser1636569550228";
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = KEYS.ADMIN;

    if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Admin username, email, or password not provided in .env file"
      );
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const entityManager = queryRunner.manager;
    const adminUser = entityManager.create(User, {
      name: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      admin: true,
    });

    await entityManager.save(adminUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "users" WHERE admin = true`);
  }
}
