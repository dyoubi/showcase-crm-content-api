import { UUID } from "crypto";

export interface Store {
    id: UUID;
    org_id: UUID;
    operator_id: UUID;
    name: string;
    /**
     * Internal root directory path
     */
    root: string;
}