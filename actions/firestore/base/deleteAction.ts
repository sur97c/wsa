// actions/firestore/base/deleteAction.ts

import { dbAdmin } from '@lib/firebase/firebaseAdmin'
import { BaseEntity } from '@models/BaseEntity'
import { FirestoreResponse, IFirestoreBaseAction } from './types'

export class DeleteFirestoreAction<T extends BaseEntity> implements IFirestoreBaseAction<T> {
  constructor (public collectionName: string) { }

  /**
   * Delete a document
   */
  async execute(id: string): Promise<FirestoreResponse<void>> {
    try {
      const docRef = dbAdmin.collection(this.collectionName).doc(id)
      const doc = await docRef.get()

      if (!doc.exists) {
        return {
          success: false,
          message: 'Document not found'
        }
      }

      await docRef.delete()

      return {
        success: true,
        message: 'Document deleted successfully'
      }
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error)
      return {
        success: false,
        error,
        message: 'Failed to delete document'
      }
    }
  }
}