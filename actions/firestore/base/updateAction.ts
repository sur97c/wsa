// actions/firestore/base/updateAction.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { FirestoreResponse, IFirestoreBaseAction } from './types'

export class UpdateFirestoreAction<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Update an existing document
   */
  async execute(id: string, data: Partial<T>): Promise<FirestoreResponse<T>> {
    try {
      const docRef = dbAdmin.collection(this.collectionName).doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return {
          success: false,
          message: 'Document not found'
        }
      }

      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      }

      await docRef.update(updateData)

      // Get the updated document
      const updatedDoc = await docRef.get()

      return {
        success: true,
        data: { id: updatedDoc.id, ...updatedDoc.data() } as T,
        message: 'Document updated successfully'
      }
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to update document'
      }
    }
  }
}