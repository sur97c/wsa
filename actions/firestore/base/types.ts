// actions/firestore/base/types.ts

import { DocumentData, QueryFieldFilterConstraint, QueryOrderByConstraint } from 'firebase-admin/firestore'
import { BaseEntity } from '@models/BaseEntity'

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

export type BatchOperationResponse = {
  success: boolean
  message?: string
  error?: any
}

export interface IFirestoreBaseAction<T extends BaseEntity> {
  collectionName: string
}