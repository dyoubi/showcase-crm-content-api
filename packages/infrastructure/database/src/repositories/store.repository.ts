import { IStoreRepository, StoreEntity } from "@ringcontent/core";
import { RepositoryCRUD } from "../common/repository";
import { StoreEntitySchema } from "../entities";
import { DataSource } from "typeorm";

export class StoreRepository extends RepositoryCRUD<StoreEntity> implements IStoreRepository {
	constructor(_ds: DataSource) { super(_ds, StoreEntitySchema); }
}