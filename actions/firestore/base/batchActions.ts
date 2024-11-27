// actions/firestore/base/batchActions.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { FirestoreResponse, BatchOperationResponse, IFirestoreBaseAction } from './types'

export class BatchFirestoreActions<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Batch create multiple documents
   */
  async batchCreate(items: Omit<T, 'id'>[]): Promise<FirestoreResponse<T[]>> {
    const batch = dbAdmin.batch()
    const timestamp = new Date().toISOString()
    const createdDocs: T[] = []

    try {
      items.forEach(item => {
        const docRef = dbAdmin.collection(this.collectionName).doc()
        const newDoc = {
          ...item,
          id: docRef.id,
          createdAt: timestamp,
          updatedAt: timestamp
        }
        batch.set(docRef, newDoc)
        createdDocs.push(newDoc as T)
      })

      await batch.commit()

      return {
        success: true,
        data: createdDocs,
        message: 'Documents created successfully'
      }
    } catch (error) {
      console.error(`Error batch creating documents in ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to create documents'
      }
    }
  }

  /**
   * Batch update multiple documents
   */
  async batchUpdate(updates: { id: string; data: Partial<T> }[]): Promise<BatchOperationResponse> {
    const batch = dbAdmin.batch()
    const timestamp = new Date().toISOString()

    try {
      for (const update of updates) {
        const docRef = dbAdmin.collection(this.collectionName).doc(update.id)
        const doc = await docRef.get()

        if (!doc.exists) {
          return {
            success: false,
            message: `Document with ID ${update.id} not found`
          }
        }

        batch.update(docRef, {
          ...update.data,
          updatedAt: timestamp
        })
      }

      await batch.commit()

      return {
        success: true,
        message: 'Documents updated successfully'
      }
    } catch (error) {
      console.error(`Error batch updating documents in ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to update documents'
      }
    }
  }

  /**
   * Batch delete multiple documents
   */
  async batchDelete(ids: string[]): Promise<BatchOperationResponse> {
    const batch = dbAdmin.batch()

    try {
      for (const id of ids) {
        const docRef = dbAdmin.collection(this.collectionName).doc(id)
        const doc = await docRef.get()

        if (!doc.exists) {
          return {
            success: false,
            message: `Document with ID ${id} not found`
          }
        }

        batch.delete(docRef)
      }

      await batch.commit()

      return {
        success: true,
        message: 'Documents deleted successfully'
      }
    } catch (error) {
      console.error(`Error batch deleting documents from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to delete documents'
      }
    }
  }
}