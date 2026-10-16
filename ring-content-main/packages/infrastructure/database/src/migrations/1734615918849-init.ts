import { readFileSync } from "fs";
import path from "path";
import { MigrationInterface, QueryRunner } from "typeorm";

const INIT_SCRIPT_PATH = path.join(__dirname, '../../sql/create-database.sql');
export class Init1734615918849 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        const sql = readFileSync(INIT_SCRIPT_PATH).toString();
        await queryRunner.connection.query(sql);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
    }

}