// models/IUser.ts

import { ParsedToken } from "firebase/auth";
import { IProfile } from "./IProfile";

export interface IUser {
    uid: string;
    email: string;
    displayName?: string;
    customClaims?: ParsedToken | null | undefined;
    profile?: IProfile | null | undefined;
}

