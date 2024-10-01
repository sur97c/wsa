// actions/firestoreActions.ts
'use server';

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { DocumentData } from 'firebase/firestore'

export async function getDocumentData<T>(collectionName: string, id: string): Promise<T | null | undefined> {
    try {
        const collectionDocument = await dbAdmin.collection(collectionName).doc(id).get()
        const collection: DocumentData | null | undefined = collectionDocument.exists ? collectionDocument.data() : null
        return collection as T
    } catch (error) {
        console.error('Error getting user data:', error)
        throw new Error('Failed to get user data')
    }
}

export async function getDocumentsData<T>(collectionName: string): Promise<T | null | undefined> {
    try {
        // const usersProfileDoc = await dbAdmin.collection(collection).get();
        // const usersProfile: DocumentData[] | null | undefined = usersProfileDoc.empty ? usersProfileDoc.docs : null;
        // usersProfile?.map(doc => {
        //     const data = doc.data() as Omit<IUser, 'firebaseId'>;
        //     return {
        //         firebaseId: doc.id,
        //         ...data
        //     };
        // });
        // return usersProfile as IUser[];
        const collectionDocument = await dbAdmin.collection(collectionName).doc('').get();
        const collection: DocumentData | null | undefined = collectionDocument.exists ? collectionDocument.data() : null;
        return collection as T;
    } catch (error) {
        console.error('Error getting users data:', error);
        throw new Error('Failed to get users data');
    }
}