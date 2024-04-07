import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1712462353710 implements MigrationInterface {
    name = 'Default1712462353710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phoneNumber" character varying, "address" character varying, "city" character varying, "state" character varying, "country" character varying, "zipCode" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "essays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, "text" text NOT NULL, "amazonLink" character varying, "status" character varying NOT NULL DEFAULT 'pending', "tags" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, CONSTRAINT "PK_93f345390e2a15e1e990d98773f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "essay_updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "annotations" text, "corrections" text, "comments" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "essayId" uuid, CONSTRAINT "PK_c6b4d9229279209870bf1886a61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "admin" boolean, "password" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updatesId" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "essays" ADD CONSTRAINT "FK_77dad7cba0104ab82e43e5d759e" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay_updates" ADD CONSTRAINT "FK_0a52d90c21bc55cf83b84dedd4c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "essay_updates" ADD CONSTRAINT "FK_7583bf4374c8d6827068c989fc4" FOREIGN KEY ("essayId") REFERENCES "essays"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_bbfddcff79d70e83df4b8fbe5da" FOREIGN KEY ("updatesId") REFERENCES "essay_updates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_bbfddcff79d70e83df4b8fbe5da"`);
        await queryRunner.query(`ALTER TABLE "essay_updates" DROP CONSTRAINT "FK_7583bf4374c8d6827068c989fc4"`);
        await queryRunner.query(`ALTER TABLE "essay_updates" DROP CONSTRAINT "FK_0a52d90c21bc55cf83b84dedd4c"`);
        await queryRunner.query(`ALTER TABLE "essays" DROP CONSTRAINT "FK_77dad7cba0104ab82e43e5d759e"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "essay_updates"`);
        await queryRunner.query(`DROP TABLE "essays"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
