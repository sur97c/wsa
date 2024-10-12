import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    QueryDocumentSnapshot,
    DocumentData,
    FirestoreDataConverter,
    where,
    query,
    WithFieldValue,
    Query,
} from 'firebase/firestore'
import { db } from '@lib/firebase/firebase'
import { RoleKey } from '@utils/rolesDefinition'

export interface BaseDocument {
    id: string
}

export interface FirestoreAdapter<T extends BaseDocument> {
    getAll: () => Promise<T[]>
    getById: (id: string) => Promise<T | null>
    create: (data: Omit<T, 'id'>) => Promise<T>
    update: (id: string, data: Partial<T>) => Promise<void>
    delete: (id: string) => Promise<void>
}

export const createFirestoreAdapter = <T extends BaseDocument>(
    collectionName: string,
    converter: FirestoreDataConverter<T, DocumentData>
): FirestoreAdapter<T> => {
    const collectionRef = collection(db, collectionName).withConverter(converter)

    return {
        async getAll() {
            const snapshot = await getDocs(collectionRef)
            return snapshot.docs.map(doc => doc.data())
        },

        async getById(id: string) {
            const docRef = doc(collectionRef, id)
            const docSnap = await getDoc(docRef)
            return docSnap.exists() ? docSnap.data() : null
        },

        async create(data: Omit<T, 'id'>) {
            const docRef = doc(collectionRef)
            const newData = { ...data, id: docRef.id } as T
            await setDoc(docRef, newData)
            return newData
        },

        async update(id: string, data: Partial<T>) {
            const docRef = doc(collectionRef, id)
            await updateDoc(docRef, data as DocumentData)
        },

        async delete(id: string) {
            const docRef = doc(collectionRef, id)
            await deleteDoc(docRef)
        }
    }
}

const createConverter = <T extends BaseDocument>(): FirestoreDataConverter<T, DocumentData> => ({
    toFirestore(doc: WithFieldValue<T>): DocumentData {
        const { id, ...data } = doc
        console.log(id)
        return data as DocumentData
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
        const data = snapshot.data()
        return { id: snapshot.id, ...data } as T
    }
})

export const createGenericAdapter = <T extends BaseDocument>(collectionName: string) => {
    const converter = createConverter<T>()
    const baseAdapter = createFirestoreAdapter<T>(collectionName, converter)

    return {
        ...baseAdapter,

        async getByField<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
            const q = query(collection(db, collectionName), where(field as string, '==', value)).withConverter(converter)
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => doc.data())
        },

        async getByQuery(queryFn: (ref: Query<DocumentData>) => Query<DocumentData>): Promise<T[]> {
            const baseQuery = collection(db, collectionName)
            const q = queryFn(baseQuery).withConverter(converter)
            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => doc.data())
        }
    }
}

// Ejemplo de uso para User
export interface User extends BaseDocument {
    name: string;
    email: string;
    roles: RoleKey[];
}

export const userAdapter = createGenericAdapter<User>('users')

// Funciones específicas para User
export const getUsersByRole = async (role: RoleKey): Promise<User[]> => {
    return userAdapter.getByQuery(q => query(q, where('roles', 'array-contains', role)))
}

export const updateUserRoles = async (userId: string, roles: RoleKey[]): Promise<void> => {
    await userAdapter.update(userId, { roles })
}