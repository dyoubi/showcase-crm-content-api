import { EntitySchemaColumnOptions } from 'typeorm';

export const DATABASE_NAME = 'ringcontent';
export const SERVICE_SCHEMA_NAME = 'service';

export type DefaultSchemaType = {
    synchronize: false,
    columns: Record<string, EntitySchemaColumnOptions>,
    orderBy?: Record<string, 'ASC' | 'DESC'>,
};

export const DefaultEntitySchema: DefaultSchemaType = {
    synchronize: false,
    orderBy: {
        updated_at: 'DESC',
        created_at: 'DESC',
    },
    columns: {
        created_at: {
            name: 'created_at',
            type: 'timestamp with time zone',
            createDate: true,
            update: false,
            nullable: false,
        },
        updated_at: {
            name: 'updated_at',
            type: 'timestamp with time zone',
            updateDate: true,
            nullable: false,
        },
    }
};
