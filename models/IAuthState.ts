// models/IAuthState.ts

import { ParsedToken } from "firebase/auth"
import { IProfile } from "./IProfile"
import { IUser } from "./IUser"

export interface IAuthState extends IUser, IProfile {
    isAuthenticated: boolean;
    customClaims?: ParsedToken | null | undefined;
    rememberMe: boolean;
    lastActivity: number | null;
    // loading: boolean;
    // error: string | null;
}