// models/IUser.ts

export interface IUser {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName?: string;
    creationTime?: string;
    lastSignInTime?: string;
}