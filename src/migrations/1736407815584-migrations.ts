import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1736407815584 implements MigrationInterface {
    name = 'Migrations1736407815584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "dikidiLink" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "tg" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "whatsApp" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "phone" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "whatsApp"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "tg"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "dikidiLink"`);
    }

}
