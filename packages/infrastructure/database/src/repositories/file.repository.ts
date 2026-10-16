import { FileEntity, FileSearchQuery, IFileRepository } from '@ringcontent/core';
import { RepositoryCRUD } from '../common/repository';
import { DataSource } from 'typeorm';
import { FileEntitySchema } from '../entities';
import { UUID } from 'crypto';
import { FieldsQuery, logger, Where } from '@egc-io/ckit-lib';
import { createTypeOrmQueryTransformer, TypeOrmQueryTransformer } from '../common';

function sanitize(match: string) {
    let pattern = match.trim()
        .replaceAll('\\', '')
        .replaceAll('\n', '')
        .replaceAll('*', '%');
    return pattern === '**' || pattern === '%%' ? '' : pattern;
}

export class FileRepository extends RepositoryCRUD<FileEntity>
    implements IFileRepository {
    override _id_field: string = 'guid';
    override builderQuery: TypeOrmQueryTransformer<FileEntity>;

    constructor(_ds: DataSource) {
        super(_ds, FileEntitySchema, 'file');
        this.builderQuery = createTypeOrmQueryTransformer(this._repo, 'file');
    }

    override findById(id: string, query?: FieldsQuery<FileEntity> | undefined, ...opts: unknown[]): Promise<FileEntity> {
        const clause = this.builderQuery(query ?? {});
        return clause.where('guid = :entity_id', { entity_id: id }).getOneOrFail();
    }

    async getByFileID(file_id: string, revision?: number): Promise<FileEntity | null> {
        const where: Where<FileEntity> = revision ? { file_id, revision } : { file_id };
        return this.findOne({ where: where, sort: { revision: 'DESC' } });
    }

    async searchCount(store_id: string, query: FileSearchQuery): Promise<number> {
        let pattern = sanitize(query.match);
        const metaList = await this._repo.query(`SELECT COUNT(file_id) FROM service.search_files_in_store($1,$2,$3,$4);`, [
            store_id,
            pattern,
            query.limit ?? 1000,
            query.offset ?? 0
        ]);
        return (metaList[0] as { count: number; }).count;
    }

    async search(store_id: UUID, query: FileSearchQuery): Promise<FileEntity[]> {
        let pattern = sanitize(query.match);
        let sql = `SELECT file.* FROM service.search_files_in_store($1,$2,$3,$4) as file`;
        if (query.sort && Object.keys(query.sort).length > 0) {
            const orders: string[] = [];
            const keys = Object.keys(query.sort) as (keyof FileEntity)[];
            for (let index = 0; index < keys.length; index++) {
                const column = keys[index];
                if (FileEntitySchema.options.columns[column]) {
                    const field_name = FileEntitySchema.options.columns[column].name ?? column;
                    orders.push(`file.${field_name} ${query.sort[column]}`);
                }
            }
            if (orders.length) { sql += `\nORDER BY\n` + orders.join(`,\n`); }
        }
        const args = [
            store_id,
            pattern,
            query.limit,
            query.offset
        ];
        console.log(sql, ...args);
        const metaList = await this._repo.query(sql, args);
        return metaList;
    }

}