// actions/firestore/base/readAction.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { FirestoreResponse, FirestoreListResponse, FirestoreQuery, IFirestoreBaseAction } from './types'

export class ReadFirestoreAction<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Get a single document by ID
   */
  async getById(id: string): Promise<FirestoreResponse<T>> {
    try {
      const docRef = dbAdmin.collection(this.collectionName).doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return {
          success: false,
          message: 'Document not found'
        }
      }

      return {
        success: true,
        data: { id: doc.id, ...doc.data() } as T
      }
    } catch (error) {
      console.error(`Error getting document from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to get document'
      }
    }
  }

  /**
   * Get multiple documents with optional query parameters
   */
  async getList(query?: FirestoreQuery): Promise<FirestoreListResponse<T>> {
    try {
      let firestoreQuery = dbAdmin.collection(this.collectionName)

      // Apply filters
      if (query?.filters) {
        query.filters.forEach(filter => {
          firestoreQuery = firestoreQuery.where(filter)
        })
      }

      // Apply ordering
      if (query?.orderBy) {
        query.orderBy.forEach(orderBy => {
          firestoreQuery = firestoreQuery.orderBy(orderBy)
        })
      }

      // Apply pagination
      if (query?.startAfter) {
        firestoreQuery = firestoreQuery.startAfter(query.startAfter)
      }

      if (query?.limit) {
        firestoreQuery = firestoreQuery.limit(query.limit)
      }

      const snapshot = await firestoreQuery.get()
      const lastDoc = snapshot.docs[snapshot.docs.length - 1]

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[]

      return {
        success: true,
        data,
        lastDoc: lastDoc?.data() || null,
        total: snapshot.size
      }
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error)
      return {
        success: false,
        data: [],
        error,
        message: 'Failed to get documents'
      }
    }
  }
}