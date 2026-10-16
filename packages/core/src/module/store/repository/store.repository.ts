import { IRepository } from "@egc-io/ckit-lib";
import { StoreEntity } from "../entities";

export type IStoreRepository = Omit<IRepository<StoreEntity>, 'delete'>;
export const STORE_ENTITY_REPOSITORY = Symbol("STORE_ENTITY_REPOSITORY");