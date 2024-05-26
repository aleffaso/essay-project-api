import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1716744246998 implements MigrationInterface {
    name = 'Default1716744246998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, CONSTRAINT "PK_118cd45183a3a624b0b22b6aaf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "essay_updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "annotations" text, "corrections" text, "comments" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "essayId" uuid NOT NULL, CONSTRAINT "PK_c6b4d9229279209870bf1886a61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tags_name_enum" AS ENUM('EDUCATION', 'TECHNOLOGY', 'SCIENCE', 'HEALTH', 'ART', 'HISTORY', 'LITERATURE', 'BUSINESS', 'SPORTS', 'ENVIRONMENT', 'POLITICS', 'CULTURE', 'SOCIETY', 'ECONOMICS', 'PHILOSOPHY')`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."tags_name_enum" NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "essay_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "essay_id" uuid NOT NULL, "tag_id" uuid NOT NULL, CONSTRAINT "PK_73ff5fc6d50a1ca060e75d3fbca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."essays_testtype_enum" AS ENUM('ENEM', 'VESTIBULAR', 'CONCURSO', 'ANPAD', 'ANPEC', 'OAB', 'RESIDENCIA_MEDICA', 'TOEFL', 'IELTS', 'SAT', 'GMAT', 'GRE', 'ESPECIFICO', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."essays_status_enum" AS ENUM('PENDING', 'IN_REVIEW', 'NEEDS_REVISION', 'REVISION_SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "essays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "testType" "public"."essays_testtype_enum" NOT NULL DEFAULT 'OTHER', "title" character varying NOT NULL, "text" text NOT NULL, "essayUploadedLink" character varying, "status" "public"."essays_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid NOT NULL, CONSTRAINT "PK_93f345390e2a15e1e990d98773f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_permissions_user-permissions" ("usersId" uuid NOT NULL, "userPermissionsId" uuid NOT NULL, CONSTRAINT "PK_92861773ce79131494c1bb2f9b9" PRIMARY KEY ("usersId", "userPermissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ac4aeceb4a0e361d339fab471" ON "users_permissions_user-permissions" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5f7c6fcb9ca9a2e911f947c16" ON "users_permissions_user-permissions" ("userPermissionsId") `);
        await queryRunner.query(`ALTER TABLE "essay_updates" ADD CONSTRAINT "FK_0a52d90c21bc55cf83b84dedd4c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay_updates" ADD CONSTRAINT "FK_7583bf4374c8d6827068c989fc4" FOREIGN KEY ("essayId") REFERENCES "essays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay_tags" ADD CONSTRAINT "FK_a5bbdbf2e4d2ad0ce71112833c9" FOREIGN KEY ("essay_id") REFERENCES "essays"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay_tags" ADD CONSTRAINT "FK_a5c010afea669c5af03f8d7b830" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essays" ADD CONSTRAINT "FK_95c5dce4a781bcff7ffcf0e5a47" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" ADD CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166" FOREIGN KEY ("userPermissionsId") REFERENCES "user-permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_f5f7c6fcb9ca9a2e911f947c166"`);
        await queryRunner.query(`ALTER TABLE "users_permissions_user-permissions" DROP CONSTRAINT "FK_8ac4aeceb4a0e361d339fab471b"`);
        await queryRunner.query(`ALTER TABLE "essays" DROP CONSTRAINT "FK_95c5dce4a781bcff7ffcf0e5a47"`);
        await queryRunner.query(`ALTER TABLE "essay_tags" DROP CONSTRAINT "FK_a5c010afea669c5af03f8d7b830"`);
        await queryRunner.query(`ALTER TABLE "essay_tags" DROP CONSTRAINT "FK_a5bbdbf2e4d2ad0ce71112833c9"`);
        await queryRunner.query(`ALTER TABLE "essay_updates" DROP CONSTRAINT "FK_7583bf4374c8d6827068c989fc4"`);
        await queryRunner.query(`ALTER TABLE "essay_updates" DROP CONSTRAINT "FK_0a52d90c21bc55cf83b84dedd4c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5f7c6fcb9ca9a2e911f947c16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ac4aeceb4a0e361d339fab471"`);
        await queryRunner.query(`DROP TABLE "users_permissions_user-permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "essays"`);
        await queryRunner.query(`DROP TYPE "public"."essays_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."essays_testtype_enum"`);
        await queryRunner.query(`DROP TABLE "essay_tags"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TYPE "public"."tags_name_enum"`);
        await queryRunner.query(`DROP TABLE "essay_updates"`);
        await queryRunner.query(`DROP TABLE "user-permissions"`);
    }

}
