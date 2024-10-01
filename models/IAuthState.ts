// models/IAuthState.ts

import { IUser } from "./IUser";

export interface IAuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    rememberMe: boolean;
    lastActivity: number | null;
    loading: boolean;
    error: string | null;
}