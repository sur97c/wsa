// lib/redux/slices/genericFirestoreSlice.ts

import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit'
import { BaseEntity } from '@models/BaseEntity'
import { EntityName } from './mockConfigSlice'
import { RootState } from '../store'
import { mockData } from '@utils/mockData/mockDataGenerator'
import { GenericFirestoreActions, FirestoreQuery } from '@actions/firestore/genericFirestoreActions'
import { DocumentData } from 'firebase-admin/firestore'

export interface FirestoreState<T extends BaseEntity> {
  documents: T[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  lastDoc?: DocumentData | null
  total?: number
}

const initialState = <T extends BaseEntity>(): FirestoreState<T> => ({
  documents: [],
  status: 'idle',
  error: null,
  lastDoc: null,
  total: 0
})

export const createGenericFirestoreSlice = <
  E extends EntityName,
  T extends BaseEntity
>(
  collectionName: string,
  entityName: E
) => {
  // Instantiate the generic actions for this collection
  const firestoreActions = new GenericFirestoreActions<T>(collectionName)

  // Create Async Thunks
  const getFirestoreDocuments = createAsyncThunk<
    { data: T[]; lastDoc?: DocumentData; total?: number },
    FirestoreQuery | undefined,
    { state: RootState }
  >(
    `firestore/${collectionName}/getDocuments`,
    async (query, thunkAPI) => {
      try {
        const state = thunkAPI.getState()
        const useMockData = state.mockConfig.useMockData &&
          state.mockConfig.mockEntities[entityName]

        if (useMockData) {
          const mockDataset = mockData.generateMockDataSet({
            [entityName]: query?.limit || 100
          })
          return {
            data: mockDataset[entityName] as T[],
            total: mockDataset[entityName].length
          }
        }

        const result = await firestoreActions.getList(query)
        if (!result.success) {
          throw new Error(result.message)
        }

        return {
          data: result.data,
          lastDoc: result.lastDoc,
          total: result.total
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch documents')
      }
    }
  )

  const getFirestoreDocument = createAsyncThunk<
    T,
    string,
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/getDocument`,
    async (id, thunkAPI) => {
      try {
        const result = await firestoreActions.getById(id)
        if (!result.success || !result.data) {
          throw new Error(result.message)
        }
        return result.data
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch document')
      }
    }
  )

  const createFirestoreDocument = createAsyncThunk<
    T,
    Omit<T, 'id'>,
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/createDocument`,
    async (data, thunkAPI) => {
      try {
        const result = await firestoreActions.create(data)
        if (!result.success || !result.data) {
          throw new Error(result.message)
        }
        return result.data
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to create document')
      }
    }
  )

  const updateFirestoreDocument = createAsyncThunk<
    T,
    { id: string; update: Partial<T> },
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/updateDocument`,
    async ({ id, update }, thunkAPI) => {
      try {
        const result = await firestoreActions.update(id, update)
        if (!result.success || !result.data) {
          throw new Error(result.message)
        }
        return result.data
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to update document')
      }
    }
  )

  const deleteFirestoreDocument = createAsyncThunk<
    string,
    string,
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/deleteDocument`,
    async (id, thunkAPI) => {
      try {
        const result = await firestoreActions.delete(id)
        if (!result.success) {
          throw new Error(result.message)
        }
        return id
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to delete document')
      }
    }
  )

  const batchCreateFirestoreDocuments = createAsyncThunk<
    T[],
    Omit<T, 'id'>[],
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/batchCreate`,
    async (items, thunkAPI) => {
      try {
        const result = await firestoreActions.batchCreate(items)
        if (!result.success || !result.data) {
          throw new Error(result.message)
        }
        return result.data
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to batch create documents')
      }
    }
  )

  const batchUpdateFirestoreDocuments = createAsyncThunk<
    void,
    { id: string; data: Partial<T> }[],
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/batchUpdate`,
    async (updates, thunkAPI) => {
      try {
        const result = await firestoreActions.batchUpdate(updates)
        if (!result.success) {
          throw new Error(result.message)
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to batch update documents')
      }
    }
  )

  const batchDeleteFirestoreDocuments = createAsyncThunk<
    string[],
    string[],
    { state: RootState; rejectValue: string }
  >(
    `firestore/${collectionName}/batchDelete`,
    async (ids, thunkAPI) => {
      try {
        const result = await firestoreActions.batchDelete(ids)
        if (!result.success) {
          throw new Error(result.message)
        }
        return ids
      } catch (error) {
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : 'Failed to batch delete documents')
      }
    }
  )

  // Create Slice
  const firestoreSlice = createSlice({
    name: `firestore/${collectionName}`,
    initialState: initialState<T>(),
    reducers: {
      clearDocuments: (state) => {
        state.documents = []
        state.status = 'idle'
        state.error = null
        state.lastDoc = null
        state.total = 0
      }
    },
    extraReducers: (builder) => {
      // Get Documents
      builder.addCase(getFirestoreDocuments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      builder.addCase(getFirestoreDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.documents = action.payload.data as Draft<T>[]
        state.lastDoc = action.payload.lastDoc
        state.total = action.payload.total
      })
      builder.addCase(getFirestoreDocuments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string
      })

      // Get Single Document
      builder.addCase(getFirestoreDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id)
        if (index !== -1) {
          state.documents[index] = action.payload as Draft<T>
        } else {
          state.documents.push(action.payload as Draft<T>)
        }
      })

      // Create Document
      builder.addCase(createFirestoreDocument.fulfilled, (state, action) => {
        state.documents.push(action.payload as Draft<T>)
        if (state.total !== undefined) state.total += 1
      })

      // Update Document
      builder.addCase(updateFirestoreDocument.fulfilled, (state, action) => {
        const index = state.documents.findIndex(doc => doc.id === action.payload.id)
        if (index !== -1) {
          state.documents[index] = action.payload as Draft<T>
        }
      })

      // Delete Document
      builder.addCase(deleteFirestoreDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => doc.id !== action.payload)
        if (state.total !== undefined) state.total -= 1
      })

      // Batch Create
      builder.addCase(batchCreateFirestoreDocuments.fulfilled, (state, action) => {
        state.documents.push(...action.payload as Draft<T>[])
        if (state.total !== undefined) state.total += action.payload.length
      })

      // Batch Delete
      builder.addCase(batchDeleteFirestoreDocuments.fulfilled, (state, action) => {
        state.documents = state.documents.filter(doc => !action.payload.includes(doc.id as string))
        if (state.total !== undefined) state.total -= action.payload.length
      })
    },
  })

  return {
    reducer: firestoreSlice.reducer,
    actions: {
      ...firestoreSlice.actions,
    },
    thunks: {
      getFirestoreDocuments,
      getFirestoreDocument,
      createFirestoreDocument,
      updateFirestoreDocument,
      deleteFirestoreDocument,
      batchCreateFirestoreDocuments,
      batchUpdateFirestoreDocuments,
      batchDeleteFirestoreDocuments,
    },
  }
}

// Ejemplo de uso:
// export const userSlice = createGenericFirestoreSlice<'users', UserDocument>('users', 'users');