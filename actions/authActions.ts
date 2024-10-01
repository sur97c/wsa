// actions/authActions.ts
'use server'

import { authAdmin, dbAdmin } from '@lib/firebase/firebaseAdmin'
import { Roles } from '@models/Roles';

export type RoleKey = typeof Roles[number]['key'];

export interface UserClaims {
    roles: RoleKey[];
}

export async function setUserClaims(userId: string, claims: UserClaims) {
    try {
        // Establecer custom claims en Firebase Auth
        await authAdmin.setCustomUserClaims(userId, claims);

        // Actualizar el documento del usuario en Firestore
        const userRef = dbAdmin.collection('users').doc(userId);
        await userRef.update({ roles: claims.roles });

        return { success: true, message: 'Roles de usuario actualizados correctamente.' };
    } catch (error) {
        console.error('Error al establecer los claims del usuario:', error);
        return { success: false, message: 'Error al actualizar los roles del usuario.' };
    }
}

export async function getUserClaims(userId: string) {
    try {
        const user = await authAdmin.getUser(userId);
        return user.customClaims as UserClaims || { roles: [] };
    } catch (error) {
        console.error('Error al obtener los claims del usuario:', error);
        return { roles: [] };
    }
}

export async function getUsersByRole(role: RoleKey) {
    try {
        const usersSnapshot = await dbAdmin.collection('users').where('roles', 'array-contains', role).get();
        return usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error al obtener usuarios por rol:', error);
        return [];
    }
}