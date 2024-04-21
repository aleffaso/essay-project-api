import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1713677087345 implements MigrationInterface {
    name = 'Default1713677087345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_118cd45183a3a624b0b22b6aaf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_permissions_user-permissions" ("usersId" uuid NOT NULL, "userPermissionsId" uuid NOT NULL, CONSTRAINT "PK_92861773ce79131494c1bb2f9b9" PRIMARY KEY ("usersId", "userPermissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ac4aeceb4a0e361d339fab471" ON "users_permissions_user-permissions" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5f7c6fcb9ca9a2e911f947c16" ON "users_permissions_user-permissions" ("userPermissionsId") `);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166" FOREIGN KEY ("userPermissionsId") REFERENCES "user-permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166"`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5f7c6fcb9ca9a2e911f947c16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ac4aeceb4a0e361d339fab471"`);
        await queryRunner.query(`DROP TABLE "users_permissions_user-permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user-permissions"`);
    }

}
