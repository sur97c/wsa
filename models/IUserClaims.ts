// models/IUserClaims.ts

import { RoleKey } from "@utils/rolesDefinition";

export interface IUserClaims {
    roles: RoleKey[];
    [key: string]: any;
}