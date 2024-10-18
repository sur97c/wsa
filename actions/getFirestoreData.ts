// actions/getFirestoreData.ts

'use server';

import { dbAdmin, authAdmin } from '@lib/firebase/firebaseAdmin';
import { DocumentData } from 'firebase-admin/firestore';

type FirestoreData<T> = T & DocumentData;

export async function getFirestoreData<T extends DocumentData>(
    collectionName: string,
    docId: string,
    includeAuthData: boolean = false
): Promise<(FirestoreData<T> & { customClaims?: { roles: string[] } }) | null> {
    try {
        const docRef = dbAdmin.collection(collectionName).doc(docId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return null;
        }

        let result = docSnap.data() as FirestoreData<T>;

        if (includeAuthData) {
            const userRecord = await authAdmin.getUser(docId);
            const customClaims = userRecord.customClaims as { roles: string[] } | undefined;
            result = { ...result, customClaims };
        }

        return result;
    } catch (error) {
        console.error(`Error getting data from ${collectionName}:`, error);
        throw new Error(`Failed to get data from ${collectionName}`);
    }
}

// Ejemplo de uso:
// interface UserProfile extends DocumentData {
//     name: string;
//     email: string;
// }
// 
// const userData = await getFirestoreData<UserProfile>('users', 'userId123', true);
// if (userData) {
//     console.log(userData.name);  // Acceso a datos de Firestore
//     console.log(userData.customClaims?.roles);  // Acceso a datos de autenticación
// }