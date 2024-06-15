import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1718422905550 implements MigrationInterface {
    name = 'Default1718422905550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_118cd45183a3a624b0b22b6aaf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "essay-updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "grade" double precision, "annotations" text, "corrections" text, "comments" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "essayId" uuid NOT NULL, CONSTRAINT "PK_67ada97ec86bf0356ccb6b3ba55" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."essays_specification_enum" AS ENUM('ENEM', 'VESTIBULAR', 'CONCURSO', 'ANPAD', 'ANPEC', 'OAB', 'RESIDENCIA_MEDICA', 'TOEFL', 'IELTS', 'SAT', 'GMAT', 'GRE', 'ESPECIFICO', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."essays_tag_enum" AS ENUM('EDUCATION', 'TECHNOLOGY', 'SCIENCE', 'HEALTH', 'ART', 'HISTORY', 'LITERATURE', 'BUSINESS', 'SPORTS', 'ENVIRONMENT', 'POLITICS', 'CULTURE', 'SOCIETY', 'ECONOMICS', 'PHILOSOPHY')`);
        await queryRunner.query(`CREATE TYPE "public"."essays_status_enum" AS ENUM('PENDING', 'IN_REVIEW', 'NEEDS_REVISION', 'REVISION_SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "essays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "specification" "public"."essays_specification_enum" NOT NULL DEFAULT 'OTHER', "tag" "public"."essays_tag_enum" NOT NULL DEFAULT 'EDUCATION', "title" character varying NOT NULL, "text" text NOT NULL, "uploadedLink" character varying, "status" "public"."essays_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid NOT NULL, CONSTRAINT "PK_93f345390e2a15e1e990d98773f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_permissions_user-permissions" ("usersId" uuid NOT NULL, "userPermissionsId" uuid NOT NULL, CONSTRAINT "PK_92861773ce79131494c1bb2f9b9" PRIMARY KEY ("usersId", "userPermissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ac4aeceb4a0e361d339fab471" ON "users_permissions_user-permissions" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5f7c6fcb9ca9a2e911f947c16" ON "users_permissions_user-permissions" ("userPermissionsId") `);
        await queryRunner.query(`ALTER TABLE "essay-updates" ADD CONSTRAINT "FK_3cdeff6366f0d04bfb49aaf3b26" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay-updates" ADD CONSTRAINT "FK_5b6d68995219a02ecb5854c828a" FOREIGN KEY ("essayId") REFERENCES "essays"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essays" ADD CONSTRAINT "FK_95c5dce4a781bcff7ffcf0e5a47" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166" FOREIGN KEY ("userPermissionsId") REFERENCES "user-permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166"`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b"`);
        await queryRunner.query(`ALTER TABLE "essays" DROP CONSTRAINT "FK_95c5dce4a781bcff7ffcf0e5a47"`);
        await queryRunner.query(`ALTER TABLE "essay-updates" DROP CONSTRAINT "FK_5b6d68995219a02ecb5854c828a"`);
        await queryRunner.query(`ALTER TABLE "essay-updates" DROP CONSTRAINT "FK_3cdeff6366f0d04bfb49aaf3b26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5f7c6fcb9ca9a2e911f947c16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ac4aeceb4a0e361d339fab471"`);
        await queryRunner.query(`DROP TABLE "users_permissions_user-permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "essays"`);
        await queryRunner.query(`DROP TYPE "public"."essays_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."essays_tag_enum"`);
        await queryRunner.query(`DROP TYPE "public"."essays_specification_enum"`);
        await queryRunner.query(`DROP TABLE "essay-updates"`);
        await queryRunner.query(`DROP TABLE "user-permissions"`);
    }

}
