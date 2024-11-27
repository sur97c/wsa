// actions/firestore/baseAction.ts
'use server'

import { BaseEntity } from '@models/BaseEntity'
import { DocumentData, QueryFieldFilterConstraint, QueryOrderByConstraint } from 'firebase-admin/firestore'
import { dbAdmin } from '@lib/firebase/firebaseAdmin'

export type FirestoreQuery = {
  filters?: QueryFieldFilterConstraint[]
  orderBy?: QueryOrderByConstraint[]
  limit?: number
  startAfter?: DocumentData
}

export type FirestoreResponse<T> = {
  success: boolean
  data?: T
  message?: string
  error?: any
}

export type FirestoreListResponse<T> = {
  success: boolean
  data: T[]
  lastDoc?: DocumentData
  total?: number
  message?: string
  error?: any
}

export abstract class BaseFirestoreAction<T extends BaseEntity> {
  constructor (protected collectionName: string) { }

  protected getCollection() {
    return dbAdmin.collection(this.collectionName)
  }

  protected getDocRef(id: string) {
    return this.getCollection().doc(id)
  }

  protected getTimestamp() {
    return new Date().toISOString()
  }

  protected async checkDocExists(id: string): Promise<boolean> {
    const doc = await this.getDocRef(id).get()
    return doc.exists
  }

  protected handleError(error: any, operation: string): FirestoreResponse<any> {
    console.error(`Error ${operation} in ${this.collectionName}:`, error)
    return {
      success: false,
      error,
      message: `Failed to ${operation}`
    }
  }
}