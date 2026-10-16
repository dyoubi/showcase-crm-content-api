import { FileEntity } from "@ringcontent/core";
import { EntitySchema } from 'typeorm';
import { DATABASE_NAME, SERVICE_SCHEMA_NAME, DefaultEntitySchema } from '../schema';

export const FileEntitySchema = new EntitySchema<FileEntity>({
    database: DATABASE_NAME,
    schema: SERVICE_SCHEMA_NAME,
    name: 'File',
    tableName: 'files',
    orderBy: {
        guid: 'DESC'
    },
    indices: [
        { name: 'fki_storage_id', columns: ['guid'] },
        { name: 'ix_file_file_id', columns: ['file_id'] }
    ],
    uniques: [
        {
            name: 'uq_file_revision',
            columns: [
                'file_name',
                'file_extension',
                'revision',
                'store_id',
                'store_path',
            ]
        },
    ],
    columns: {
        guid: {
            name: 'guid',
            type: 'uuid',
            generated: 'uuid',
            primary: true,
            primaryKeyConstraintName: 'pk_file_guid',
        },
        name: { type: 'varchar', length: 128, update: true },
        description: { type: 'text', name: 'description' },
        file_id: { type: 'varchar', length: 256, update: false },
        file_name: { type: 'varchar', length: 128, update: true },
        file_extension: { type: 'varchar', length: 128, update: false },
        mimetype: { type: 'varchar', length: 256, update: false },
        revision: { type: 'integer', default: 0, update: false },
        store_id: { type: 'uuid', update: false, nullable: true },
        store_path: { type: 'varchar', update: true, nullable: true },
        size: { type: 'varchar', update: true, nullable: true },
        ...DefaultEntitySchema.columns,
    },
});