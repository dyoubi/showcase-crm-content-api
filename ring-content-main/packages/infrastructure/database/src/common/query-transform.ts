import { Query, WhereQuery, WhereTransformer } from '@egc-io/ckit-lib';

import {
    Repository,
    SelectQueryBuilder
} from 'typeorm';

export type Entity =  { id: string; } |{ guid: string; }
interface WhereCondition {
    [key: string]: any;
}

export function applyWhere<T extends Entity>(qb: SelectQueryBuilder<T>, where: WhereCondition): SelectQueryBuilder<T> {
    for (const key of Object.keys(where)) {
        const condition = where[key];
        if (typeof condition === 'object' && condition !== null) {
            for (const operator of Object.keys(condition)) {
                const value = condition[operator];
                if (value === undefined) { continue; }
                const propertyKey = `_prop_${key}_${operator}_`;
                switch (operator) {
                    case 'eq':
                        qb.andWhere(`${qb.alias}.${key} = :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'neq':
                        qb.andWhere(`${qb.alias}.${key} != :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'gt':
                        qb.andWhere(`${qb.alias}.${key} > :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'gte':
                        qb.andWhere(`${qb.alias}.${key} >= :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'lt':
                        qb.andWhere(`${qb.alias}.${key} < :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'lte':
                        qb.andWhere(`${qb.alias}.${key} <= :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'inq':
                        Array.isArray(value);
                        qb.andWhere(`${qb.alias}.${key} IN (:...${propertyKey})`, { [`${propertyKey}`]: Array.isArray(value) ? value : [value] });
                        break;
                    case 'nin':
                        qb.andWhere(`${qb.alias}.${key} NOT IN (:...${propertyKey})`, { [`${propertyKey}`]: Array.isArray(value) ? value : [value] });
                        break;
                    case 'between':
                        const rangestart = `_prop_${key}_range_start_`;
                        const rangend = `_prop_${key}_range_end_`;
                        qb.andWhere(`${qb.alias}.${key} BETWEEN :${rangestart} AND :${rangend}`, { [rangestart]: value[0], [rangend]: value[1] });
                        break;
                    case 'like':
                        qb.andWhere(`${qb.alias}.${key} LIKE :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    case 'ilike':
                        qb.andWhere(`${qb.alias}.${key} NOT LIKE :${propertyKey}`, { [`${propertyKey}`]: value });
                        break;
                    default:
                        throw new Error(`Unsupported operator ${operator}`);
                }
            }
        } else {
            const propertyKey = `_prop_${key}_val_`;
            qb.andWhere(`${qb.alias}.${key} = :${propertyKey}`, { [`${propertyKey}`]: condition });
        }
    };

    return qb;
}

/**
 * Transformer pour convertir un objet Query en une requête TypeORM.
 */
export type TypeOrmQueryTransformer<T extends Entity> = WhereTransformer<T, SelectQueryBuilder<T>>;
export const createTypeOrmQueryTransformer = <T extends Entity>(repo: Repository<T>, alias: string):
    TypeOrmQueryTransformer<T> => {
    return (query: Query<T> & WhereQuery<T>) => {
        const queryBuilder = repo.createQueryBuilder(alias);
        if (query.fields) {
            queryBuilder.select(query.fields as string[]);
        }

        if (query.where) {
            applyWhere(queryBuilder, query.where);
        }

        if (query.sort) {
            for (const field of Object.keys(query.sort)) {
                const sort: 'ASC' | 'DESC' | null = query.sort[field as keyof T] ?? null;
                if (sort) {
                    queryBuilder.addOrderBy(`${alias}.${field}`, sort);
                }
            };
        }

        if (query.limit) {
            queryBuilder.take(query.limit);
        }

        if (query.offset) {
            queryBuilder.skip(query.offset);
        }
        return queryBuilder;
    };
};
