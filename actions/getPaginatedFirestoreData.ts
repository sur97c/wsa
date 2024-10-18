// actions/getPaginatedFirestoreData.ts

'use server';

import { dbAdmin } from '@lib/firebase/firebaseAdmin';
import { DocumentData } from 'firebase-admin/firestore';

type FirestoreData<T> = T & { id: string };

interface PaginatedResult<T> {
  data: FirestoreData<T>[];
  nextCursor: string | null;
}

export async function getPaginatedFirestoreData<T extends DocumentData>(
    collectionName: string,
    limit: number = 10,
    orderBy: { field: string; direction: 'asc' | 'desc' },
    cursor: string | null = null
): Promise<PaginatedResult<T>> {
    try {
        let query = dbAdmin.collection(collectionName)
            .orderBy(orderBy.field, orderBy.direction)
            .limit(limit);

        if (cursor) {
            const cursorDoc = await dbAdmin.collection(collectionName).doc(cursor).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }

        const snapshot = await query.get();

        const data: FirestoreData<T>[] = snapshot.docs.map(doc => ({
            ...(doc.data() as T),
            id: doc.id
        }));

        const lastDoc = snapshot.docs[snapshot.docs.length - 1];

        return {
            data,
            nextCursor: lastDoc?.id ?? null
        };
    } catch (error) {
        console.error(`Error getting data from ${collectionName}:`, error);
        throw new Error(`Failed to get data from ${collectionName}`);
    }
}

// Ejemplo de uso:
// export async function getUsers(cursor?: string) {
//     return getPaginatedFirestoreData<UserProfile>(
//         'users', 
//         10, 
//         { field: 'name', direction: 'asc' }, 
//         cursor
//     );
// }



// export async function getDocumentData<T>(collectionName: string, id: string): Promise<T | null | undefined> {
//     try {
//         const collectionDocument = await dbAdmin.collection(collectionName).doc(id).get()
//         const collection: DocumentData | null | undefined = collectionDocument.exists ? collectionDocument.data() : null
//         return collection as T
//     } catch (error) {
//         console.error('Error getting user data:', error)
//         throw new Error('Failed to get user data')
//     }
// }

// export async function getDocumentsData<T>(collectionName: string): Promise<T | null | undefined> {
//     try {
//         // const usersProfileDoc = await dbAdmin.collection(collection).get()
//         // const usersProfile: DocumentData[] | null | undefined = usersProfileDoc.empty ? usersProfileDoc.docs : null
//         // usersProfile?.map(doc => {
//         //     const data = doc.data() as Omit<IUser, 'firebaseId'>
//         //     return {
//         //         firebaseId: doc.id,
//         //         ...data
//         //     }
//         // })
//         // return usersProfile as IUser[]
//         const collectionDocuments = await dbAdmin.collection(collectionName).get()
//         const collection: DocumentData[] | null | undefined // = collectionDocuments. .exists ? collectionDocument.data() : null
//         return collection as T
//     } catch (error) {
//         console.error('Error getting users data:', error)
//         throw new Error('Failed to get users data')
//     }
// }