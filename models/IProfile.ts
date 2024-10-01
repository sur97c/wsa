// models/IProfile.ts

export interface IProfile {
    disabled: boolean;
    firebaseId: string;
    lastName?: string;
    name: string;
    roles: string[];
}