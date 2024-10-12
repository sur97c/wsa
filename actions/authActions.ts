// actions/authActions.ts

'use server'

import { authAdmin, dbAdmin } from '@lib/firebase/firebaseAdmin'
import { IUserClaims } from '@models/IUserClaims';
import { RoleKey, RoleKeys } from '@utils/rolesDefinition'
import { IProfile } from '@models/IProfile';

export async function setUserClaims(userId: string, claims: IUserClaims) {
    try {
        // Validar que los roles proporcionados sean válidos
        const invalidRoles = claims.roles.filter(role => !RoleKeys.includes(role));
        if (invalidRoles.length > 0) {
            throw new Error(`Roles inválidos: ${invalidRoles.join(', ')}`);
        }

        // Establecer custom claims en Firebase Auth
        await authAdmin.setCustomUserClaims(userId, claims);

        // Actualizar roles en Firestore para mantener la sincronización
        const userRef = dbAdmin.collection('users').doc(userId);
        await userRef.update({ roles: claims.roles });

        return { success: true, message: 'Claims y roles de usuario actualizados correctamente.' };
    } catch (error) {
        console.error('Error al establecer los claims y roles del usuario:', error);
        return { success: false, message: 'Error al actualizar los claims y roles del usuario.' };
    }
}

export async function getUserStatus(userId: string): Promise<{ disabled: boolean; customClaims: IUserClaims }> {
    try {
        const user = await authAdmin.getUser(userId);
        const customClaims = (user.customClaims as IUserClaims) || { roles: [] };
        return {
            disabled: user.disabled,
            customClaims: customClaims
        };
    } catch (error) {
        console.error('Error al obtener el estado del usuario:', error);
        throw new Error('Error al obtener el estado del usuario');
    }
}

export async function setUserDisabledStatus(userId: string, disabled: boolean) {
    try {
        // Actualizar el estado en Authentication
        await authAdmin.updateUser(userId, { disabled });

        // Actualizar el estado en Firestore para mantener la sincronización
        const userRef = dbAdmin.collection('users').doc(userId);
        await userRef.update({ disabled });

        return { success: true, message: 'Estado de usuario actualizado correctamente.' };
    } catch (error) {
        console.error('Error al actualizar el estado del usuario:', error);
        throw new Error('Error al actualizar el estado del usuario');
    }
}

export async function getUsersByRole(role: RoleKey) {
    try {
        // Usar Firestore para obtener usuarios por rol
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

export async function syncUserRoles(userId: string) {
    try {
        const { customClaims } = await getUserStatus(userId);
        const userRef = dbAdmin.collection('users').doc(userId);
        await userRef.update({ roles: customClaims.roles });
        return { success: true, message: 'Roles sincronizados correctamente.' };
    } catch (error) {
        console.error('Error al sincronizar roles:', error);
        return { success: false, message: 'Error al sincronizar roles.' };
    }
}

export async function createUser(userData: Partial<IProfile> & { email: string; password: string }) {
    try {
        // Crear usuario en Firebase Auth
        const userRecord = await authAdmin.createUser({
            email: userData.email,
            password: userData.password,
            displayName: `${userData.name} ${userData.lastName}`.trim(),
        });

        // Crear documento de usuario en Firestore
        const userDocRef = dbAdmin.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            firebaseId: userRecord.uid,
            name: userData.name || '',
            lastName: userData.lastName || '',
            roles: [],
            disabled: false,
            // Añade aquí otros campos que quieras almacenar en el perfil
        });

        return { success: true, userId: userRecord.uid, message: 'Usuario creado correctamente.' };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { success: false, message: 'Error al crear usuario.' };
    }
}

export async function updateUserProfile(userId: string, profileData: Partial<IProfile>) {
    try {
        const userRef = dbAdmin.collection('users').doc(userId);
        await userRef.update(profileData);

        // Si se actualiza el nombre o apellido, actualizar también en Auth
        if (profileData.name || profileData.lastName) {
            const user = await authAdmin.getUser(userId);
            const newDisplayName = `${profileData.name || user.displayName?.split(' ')[0]} ${profileData.lastName || user.displayName?.split(' ')[1]}`.trim();
            await authAdmin.updateUser(userId, { displayName: newDisplayName });
        }

        return { success: true, message: 'Perfil de usuario actualizado correctamente.' };
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        return { success: false, message: 'Error al actualizar el perfil del usuario.' };
    }
}

export async function deleteUser(userId: string) {
    try {
        // Eliminar usuario de Firebase Auth
        await authAdmin.deleteUser(userId);

        // Eliminar documento de usuario de Firestore
        await dbAdmin.collection('users').doc(userId).delete();

        return { success: true, message: 'Usuario eliminado correctamente.' };
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return { success: false, message: 'Error al eliminar usuario.' };
    }
}