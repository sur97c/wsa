// models/IQuote.ts

import type { BaseEntity } from "./BaseEntity"

export interface IQuote extends BaseEntity {
    quoteNumber: string
    clientId: string
    clientName: string
    type: string
    expiresAt: string
    premium: number
    coverage: number
    insuranceCompany: string
    agent: string
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted'
}