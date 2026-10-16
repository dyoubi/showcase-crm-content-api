import { DataSource, DeepPartial, EntitySchema, Repository } from "typeorm";
import {
    createTypeOrmQueryTransformer, Entity,
    TypeOrmQueryTransformer
} from "./query-transform";
import { QueryWhere, FieldsQuery, Where } from "@egc-io/ckit-lib";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class RepositoryCRUD<E extends Entity> {
    readonly _id_field:string = 'id';
    _repo: Repository<E>;
    builderQuery: TypeOrmQueryTransformer<E>;

    constructor(private _ds: DataSource, schema: EntitySchema<E>, alias?: string) {
        this._repo = _ds.getRepository(schema);
        this.builderQuery = createTypeOrmQueryTransformer(this._repo, alias ?? schema.options.name.toLowerCase());
    }

    create(data: DeepPartial<E>, ...opts: unknown[]): Promise<E> {
        return this._repo.save(data);
    }

    find(query?: QueryWhere<E> | undefined, ...opts: unknown[]): Promise<E[]> {
        const clause = this.builderQuery(query ?? {});
        return clause.getMany();
    }
    findOne(query?: QueryWhere<E> | undefined, ...opts: unknown[]): Promise<E | null> {
        const clause = this.builderQuery(query ?? {});
        return clause.getOne();
    }
    findById(id: string, query?: FieldsQuery<E> | undefined, ...opts: unknown[]): Promise<E> {
        const clause = this.builderQuery(query ?? {});
        return clause.where(`${this._id_field} = :entity_id`, { entity_id: id }).getOneOrFail();
    }
    count(query?: QueryWhere<E> | undefined, ...opts: unknown[]): Promise<number> {
        return this.builderQuery(query ?? {}).getCount();
    }
    update(data: QueryDeepPartialEntity<E>, where?: Where<E> | undefined, ...opts: unknown[]): Promise<void> {
        const clause = this.builderQuery(where ?? {});
        return clause.update(data as any).execute().then();
    }
    updateById(id: string, data: QueryDeepPartialEntity<E>, opts?: object): Promise<void> {
        const clause = this.builderQuery({});
        return clause.update()
            .set(data)
            .whereInIds([id])
            .execute()
            .then();
    }

    delete(where: Where<E>, ...opts: unknown[]): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deleteById(id: string, ...opts: unknown[]): Promise<void> {
        const clause = this.builderQuery({});
        return clause.delete()
            .whereInIds([id])
            .execute()
            .then();
    }



}