// models/IAuthState.ts

import { IProfile } from "./IProfile"
import { IUser } from "./IUser"
import { IUserClaims } from "./IUserClaims"

export interface IAuthState extends IUser, IProfile {
    isAuthenticated: boolean;
    disabled: boolean;
    customClaims?: IUserClaims;
    rememberMe: boolean;
    lastActivity: number | null;
}