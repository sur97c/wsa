// lib/redux/slices/genericFirestoreSlice.ts

import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit'
import { getPaginatedFirestoreData } from '@actions/getPaginatedFirestoreData'
import { FirebaseError } from 'firebase/app'
import { BaseDocument } from '@lib/firebase/adapters/firestoreAdapter'
import { RootState } from '../store'
import { EntityName } from './mockConfigSlice'
import { mockData } from '@utils/mockData/mockDataGenerator'
import { IUser } from '@models/IUser'
import { IProfile } from '@models/IProfile'
import { IClient } from '@models/IClient'
import { IPolicy } from '@models/IPolicy'
import { IClaim } from '@models/IClaim'
import { IQuote } from '@models/IQuote'
import { BaseEntity } from '@models/BaseEntity'
import { TableRecord } from '../../../types/table'

type UserWithProfile = IUser & IProfile

// Mapeo de entidades a sus tipos correspondientes
type EntityTypeMap = {
    users: UserWithProfile
    clients: IClient
    policies: IPolicy
    claims: IClaim
    quotes: IQuote
}

type FirestoreData<T> = T & BaseDocument

interface PaginatedResult<T> {
    data: T[]
}

export interface FirestoreState<T extends BaseEntity> {
    documents: TableRecord<T>[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialFirestoreState = <T extends BaseEntity>(): FirestoreState<T> => ({
    documents: [],
    status: 'idle',
    error: null,
})

type BaseRecord<T = unknown> = {
    id?: string
    createdAt?: string
    updatedAt?: string
    createdBy?: string
    updatedBy?: string
} & Partial<T>

const ensureTableRecord = <T extends BaseEntity>(
    data: BaseRecord<T>,
    entityName: EntityName
): TableRecord<T> => {
    const now = new Date().toISOString()
    const baseRecord = {
        id: data.id || '',
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
        createdBy: data.createdBy || '',
        updatedBy: data.updatedBy || '',
        ...data
    }

    if (entityName === 'users') {
        return {
            ...baseRecord,
            uid: (baseRecord as { uid?: string }).uid || baseRecord.id || '',
            emailVerified: (baseRecord as { emailVerified?: boolean }).emailVerified ?? false,
            status: (baseRecord as { status?: string }).status || 'active'
        } as TableRecord<T>
    }

    return baseRecord as TableRecord<T>
}

export const createGenericFirestoreSlice = <
    E extends EntityName,
    T extends EntityTypeMap[E] & BaseEntity
>(
    collectionName: string,
    entityName: E
) => {
    const getFirestoreDocuments = createAsyncThunk<
        PaginatedResult<TableRecord<T>>,
        void,
        { state: RootState; rejectValue: string }
    >(
        `firestore/${collectionName}/getDocuments`,
        async (_, thunkAPI) => {
            try {
                const state = thunkAPI.getState()
                const useMockData = state.mockConfig.useMockData &&
                    state.mockConfig.mockEntities[entityName]

                if (useMockData) {
                    const mockDataset = mockData.generateMockDataSet({
                        [entityName]: 100
                    })

                    const mockDataWithTypes = (mockDataset[entityName] as unknown as Partial<T>[])
                        .map(item => ensureTableRecord<T>(item, entityName))

                    return {
                        data: mockDataWithTypes
                    }
                }

                const result = await getPaginatedFirestoreData<FirestoreData<T>>(
                    collectionName,
                    100,
                    { field: 'name', direction: 'asc' }
                )

                if (!result) {
                    return thunkAPI.rejectWithValue('No documents found or an error occurred')
                }

                const tableData = result.data
                    .map(item => ensureTableRecord<T>(item, entityName))

                return {
                    data: tableData
                }
            } catch (error) {
                if (error instanceof FirebaseError) {
                    return thunkAPI.rejectWithValue(error.message)
                }
                return thunkAPI.rejectWithValue('An unexpected error occurred')
            }
        }
    )

    const updateFirestoreDocument = createAsyncThunk<
        TableRecord<T>,
        { id: string; update: Partial<T> },
        { state: RootState; rejectValue: string }
    >(
        `firestore/${collectionName}/updateDocument`,
        async (data: { id: string; update: Partial<T> }, thunkAPI) => {
            try {
                const state = thunkAPI.getState()
                const useMockData = state.mockConfig.useMockData &&
                    state.mockConfig.mockEntities[entityName]

                if (useMockData) {
                    return ensureTableRecord<T>({
                        ...data.update,
                        id: data.id,
                        updatedAt: new Date().toISOString(),
                        updatedBy: 'mock-user'
                    }, entityName)
                }

                throw new Error('Real update functionality not implemented')
            } catch (error) {
                console.error(error)
                return thunkAPI.rejectWithValue('Failed to update document')
            }
        }
    )

    const firestoreSlice = createSlice({
        name: `firestore/${collectionName}`,
        initialState: initialFirestoreState<T>(),
        reducers: {},
        extraReducers: (builder) => {
            builder
                .addCase(getFirestoreDocuments.pending, (state) => {
                    state.status = 'loading'
                })
                .addCase(getFirestoreDocuments.fulfilled, (state, action: PayloadAction<PaginatedResult<TableRecord<T>>>) => {
                    state.status = 'succeeded'
                    state.documents = action.payload.data as Draft<TableRecord<T>>[]
                })
                .addCase(getFirestoreDocuments.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.payload ?? 'Unknown error occurred'
                })
                .addCase(updateFirestoreDocument.pending, (state) => {
                    state.status = 'loading'
                })
                .addCase(updateFirestoreDocument.fulfilled, (state, action: PayloadAction<TableRecord<T>>) => {
                    state.status = 'succeeded'
                    const updatedDoc = action.payload
                    // Asegurarnos que state.documents sea tratado como Array<TableRecord<T>>
                    const documents = state.documents as Array<TableRecord<T>>
                    const index = documents.findIndex(doc => doc.id === updatedDoc.id)
                    if (index !== -1) {
                        state.documents[index] = updatedDoc as Draft<TableRecord<T>>
                    }
                })
                .addCase(updateFirestoreDocument.rejected, (state, action) => {
                    state.status = 'failed'
                    state.error = action.payload as string
                })
        },
    })

    return {
        reducer: firestoreSlice.reducer,
        actions: firestoreSlice.actions,
        thunks: {
            getFirestoreDocuments,
            updateFirestoreDocument,
        },
    }
}

// Example usage for users
// import { IUser } from '@/types/IUser';
// export const userFirestoreSlice = createGenericFirestoreSlice<IUser>('users');
// You can now use userFirestoreSlice.reducer, userFirestoreSlice.thunks.getFirestoreDocuments, etc.