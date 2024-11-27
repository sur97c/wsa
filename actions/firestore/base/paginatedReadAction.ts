// actions/firestore/base/paginatedReadAction.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { DocumentData } from 'firebase-admin/firestore'
import { FirestoreResponse, IFirestoreBaseAction } from './types'

export interface PaginatedResult<T> {
  data: T[]
  nextCursor: string | null
  total: number
}

export interface PaginationOptions {
  limit?: number
  orderBy?: {
    field: string
    direction: 'asc' | 'desc'
  }
  cursor?: string | null
  filters?: {
    field: string
    operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'array-contains'
    value: any
  }[]
}

export class PaginatedReadFirestoreAction<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Get paginated documents with cursor-based pagination
   */
  async getPaginated(options: PaginationOptions = {}): Promise<FirestoreResponse<PaginatedResult<T>>> {
    try {
      const {
        limit = 10,
        orderBy = { field: 'createdAt', direction: 'desc' },
        cursor = null,
        filters = []
      } = options

      let query = dbAdmin.collection(this.collectionName)

      // Apply filters
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value)
      })

      // Apply ordering
      query = query.orderBy(orderBy.field, orderBy.direction)

      // Apply cursor if provided
      if (cursor) {
        const cursorDoc = await dbAdmin.collection(this.collectionName).doc(cursor).get()
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc)
        }
      }

      // Get total count before applying limit
      const totalSnapshot = await query.count().get()
      const total = totalSnapshot.data().count

      // Apply limit and get documents
      const snapshot = await query.limit(limit).get()
      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      const data = snapshot.docs.map((doc: DocumentData & { id: string }) => ({
        id: doc.id,
        ...doc.data()
      })) as T[]

      return {
        success: true,
        data: {
          data,
          nextCursor: lastDoc?.id ?? null,
          total
        }
      }
    } catch (error) {
      console.error(`Error getting paginated data from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to get paginated data'
      }
    }
  }

  /**
   * Get paginated documents with skip/limit pagination (less efficient for large datasets)
   */
  async getPaginatedWithSkip(
    page: number = 1,
    pageSize: number = 10,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<FirestoreResponse<{ data: T[]; total: number; pages: number }>> {
    try {
      const skip = (page - 1) * pageSize
      let query = dbAdmin.collection(this.collectionName)

      // Apply ordering if specified
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction)
      }

      // Get total count
      const totalSnapshot = await query.count().get()
      const total = totalSnapshot.data().count
      const pages = Math.ceil(total / pageSize)

      // Get paginated data
      const snapshot = await query
        .offset(skip)
        .limit(pageSize)
        .get()

      const data = snapshot.docs.map((doc: DocumentData & { id: string }) => ({
        id: doc.id,
        ...doc.data()
      })) as T[]

      return {
        success: true,
        data: {
          data,
          total,
          pages
        }
      }
    } catch (error) {
      console.error(`Error getting paginated data from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to get paginated data'
      }
    }
  }

  /**
   * Optimized query for virtual lists or infinite scroll
   */
  async getVirtualizedData(
    startIndex: number,
    stopIndex: number,
    orderBy?: { field: string; direction: 'asc' | 'desc' }
  ): Promise<FirestoreResponse<{ data: T[]; total: number }>> {
    try {
      let query = dbAdmin.collection(this.collectionName)

      // Apply ordering if specified
      if (orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction)
      }

      // Get total count
      const totalSnapshot = await query.count().get()
      const total = totalSnapshot.data().count

      // Get data for the specified range
      const snapshot = await query
        .offset(startIndex)
        .limit(stopIndex - startIndex + 1)
        .get()

      const data = snapshot.docs.map((doc: DocumentData & { id: string }) => ({
        id: doc.id,
        ...doc.data()
      })) as T[]

      return {
        success: true,
        data: {
          data,
          total
        }
      }
    } catch (error) {
      console.error(`Error getting virtualized data from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to get virtualized data'
      }
    }
  }
}