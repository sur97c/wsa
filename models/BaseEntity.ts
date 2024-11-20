// models/BaseEntity.ts

export interface BaseEntity {
    id: string
    createdAt: string
    updatedAt?: string
    createdBy: string
    updatedBy: string
}