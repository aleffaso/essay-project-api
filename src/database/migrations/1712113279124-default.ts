import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1712113279124 implements MigrationInterface {
    name = 'Default1712113279124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "essays" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying NOT NULL, "text" text NOT NULL, "uploadDate" TIMESTAMP NOT NULL, "amazonLink" character varying, "annotations" text, "status" character varying NOT NULL DEFAULT 'pending', "corrections" text, "tags" character varying, "comments" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_93f345390e2a15e1e990d98773f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "essays"`);
    }

}
