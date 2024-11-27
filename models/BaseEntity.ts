// models/BaseEntity.ts

export interface BaseEntity {
  id: string | number
  createdAt?: string
  updatedAt?: string
  createdBy?: string
  updatedBy?: string
}