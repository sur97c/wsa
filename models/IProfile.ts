// models/IProfile.ts

import type { BaseEntity } from "./BaseEntity"

export interface IProfile extends BaseEntity {
    id: string;
    name: string;
    lastName: string;
    status: 'active' | 'inactive'
}