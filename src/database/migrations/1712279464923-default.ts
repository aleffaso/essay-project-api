import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1712279464923 implements MigrationInterface {
    name = 'Default1712279464923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "essays" DROP COLUMN "uploadDate"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "essays" ADD "uploadDate" TIMESTAMP NOT NULL`);
    }

}
