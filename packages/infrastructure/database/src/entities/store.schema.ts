import { StoreEntity } from "@ringcontent/core";
import { EntitySchema } from 'typeorm';
import { DATABASE_NAME, SERVICE_SCHEMA_NAME, DefaultEntitySchema } from '../schema';

export const StoreEntitySchema = new EntitySchema<StoreEntity>({
    database: DATABASE_NAME,
    schema: SERVICE_SCHEMA_NAME,
    name: 'Store',
    tableName: 'stores',
    orderBy: { id: 'DESC', created_at:'DESC' },
    columns: {
        id: {
            name: 'id',
            type: 'uuid',
            generated: 'uuid',
            primary: true,
            primaryKeyConstraintName: 'pk_store_id',
        },
        operator_id: { type: 'uuid', update: false, nullable: true },
        org_id: { type: 'uuid', update: false, nullable: true },
        name: { type: 'varchar', length: 64, update: true, nullable: false },
        root: { type: 'varchar', length: 64, unique: true, nullable: false },
        ...DefaultEntitySchema.columns,
    },
});