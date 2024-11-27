// actions/firestore/base/createAction.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { FirestoreResponse, IFirestoreBaseAction } from './types'

export class CreateFirestoreAction<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Create a new document
   */
  async execute(data: Omit<T, 'id'>): Promise<FirestoreResponse<T>> {
    try {
      const docRef = dbAdmin.collection(this.collectionName).doc()
      const timestamp = new Date().toISOString()

      const newDoc = {
        ...data,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      await docRef.set(newDoc)

      return {
        success: true,
        data: newDoc as T,
        message: 'Document created successfully'
      }
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to create document'
      }
    }
  }
}