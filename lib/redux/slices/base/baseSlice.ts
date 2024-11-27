// lib/redux/slices/base/baseSlice.ts

import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit'
import { BaseEntity } from '@models/BaseEntity'
import { EntityName } from '../mockConfigSlice'
import { RootState } from '../../store'
import {
  GenericFirestoreActions,
  PaginationOptions,
  FirestoreQuery
} from '@actions/firestore/genericFirestoreActions'
import { mockData } from '@utils/mockData/mockDataGenerator'

export interface BaseState<T extends BaseEntity> {
  items: T[]
  selectedItem: T | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    cursor: string | null
  }
}

const initialState = <T extends BaseEntity>(): BaseState<T> => ({
  items: [],
  selectedItem: null,
  status: 'idle',
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    cursor: null
  }
})

export const createBaseSlice = <E extends EntityName, T extends BaseEntity>(
  entityName: E,
  collectionName: string
) => {
  // Instanciar las acciones de Firestore
  const firestoreActions = new GenericFirestoreActions<T>(collectionName)

  // Crear Async Thunks
  const fetchItems = createAsyncThunk<
    { items: T[]; totalItems: number; cursor: string | null },
    PaginationOptions | undefined,
    { state: RootState }
  >(
    `${entityName}/fetchItems`,
    async (options, { getState }) => {
      const state = getState()
      const useMockData = state.mockConfig.useMockData &&
        state.mockConfig.mockEntities[entityName]

      if (useMockData) {
        const mockDataset = mockData.generateMockDataSet({
          [entityName]: options?.limit || 10
        })
        return {
          items: mockDataset[entityName] as T[],
          totalItems: mockDataset[entityName].length,
          cursor: null
        }
      }

      const response = await firestoreActions.getPaginated(options || {})
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch items')
      }

      return {
        items: response.data.data,
        totalItems: response.data.total,
        cursor: response.data.nextCursor
      }
    }
  )

  const fetchById = createAsyncThunk<
    T,
    string,
    { state: RootState }
  >(
    `${entityName}/fetchById`,
    async (id) => {
      const response = await firestoreActions.getById(id)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch item')
      }
      return response.data
    }
  )

  const createItem = createAsyncThunk<
    T,
    Omit<T, 'id'>,
    { state: RootState }
  >(
    `${entityName}/create`,
    async (data) => {
      const response = await firestoreActions.create(data)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create item')
      }
      return response.data
    }
  )

  const updateItem = createAsyncThunk<
    T,
    { id: string; data: Partial<T> },
    { state: RootState }
  >(
    `${entityName}/update`,
    async ({ id, data }) => {
      const response = await firestoreActions.update(id, data)
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update item')
      }
      return response.data
    }
  )

  const deleteItem = createAsyncThunk<
    string,
    string,
    { state: RootState }
  >(
    `${entityName}/delete`,
    async (id) => {
      const response = await firestoreActions.delete(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete item')
      }
      return id
    }
  )

  // Crear Slice
  const slice = createSlice({
    name: entityName,
    initialState: initialState<T>(),
    reducers: {
      setSelectedItem: (state: Draft<BaseState<T>>, action: PayloadAction<Draft<T> | null>) => {
        state.selectedItem = action.payload
      },
      clearItems: (state: Draft<BaseState<T>>) => {
        state.items = []
        state.status = 'idle'
        state.error = null
      },
      resetPagination: (state: Draft<BaseState<T>>) => {
        state.pagination = initialState<T>().pagination
      }
    },
    extraReducers: (builder) => {
      // Fetch Items
      builder.addCase(fetchItems.pending, (state: Draft<BaseState<T>>) => {
        state.status = 'loading'
        state.error = null
      })
      builder.addCase(fetchItems.fulfilled, (state: Draft<BaseState<T>>, action) => {
        state.status = 'succeeded'
        state.items = action.payload.items as Draft<T>[]
        state.pagination.totalItems = action.payload.totalItems
        state.pagination.cursor = action.payload.cursor
      })
      builder.addCase(fetchItems.rejected, (state: Draft<BaseState<T>>, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Unknown error'
      })

      // Fetch By Id
      builder.addCase(fetchById.fulfilled, (state: Draft<BaseState<T>>, action) => {
        state.selectedItem = action.payload as Draft<T>
      })

      // Create Item
      builder.addCase(createItem.fulfilled, (state: Draft<BaseState<T>>, action) => {
        state.items.push(action.payload as Draft<T>)
        state.pagination.totalItems += 1
      })

      // Update Item
      builder.addCase(updateItem.fulfilled, (state: Draft<BaseState<T>>, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload as Draft<T>
        }
        if (state.selectedItem?.id === action.payload.id) {
          state.selectedItem = action.payload as Draft<T>
        }
      })

      // Delete Item
      builder.addCase(deleteItem.fulfilled, (state: Draft<BaseState<T>>, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        if (state.selectedItem?.id === action.payload) {
          state.selectedItem = null
        }
        state.pagination.totalItems -= 1
      })
    }
  })

  return {
    slice,
    actions: {
      ...slice.actions,
    },
    thunks: {
      fetchItems,
      fetchById,
      createItem,
      updateItem,
      deleteItem
    }
  }
}