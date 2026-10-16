import { UUID } from "crypto";
import { Store } from "../../../common/interfaces";

export class StoreEntity implements Store {
    id: UUID;
    org_id: UUID;
    operator_id: UUID;
    name: string;
    /**
     * root directory within the host filesystem
     */
    root: string;
}