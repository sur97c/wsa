// models/IClaim.ts

import type { BaseEntity } from "./BaseEntity"

export interface IClaim extends BaseEntity {
    claimNumber: string
    policyId: string
    policyNumber: string
    clientId: string
    clientName: string
    type: string
    description: string
    amount: number
    dateOfIncident: string
    dateSubmitted: string
    dateResolved?: string
    adjuster?: string
    status: 'new' | 'in_progress' | 'pending_info' | 'approved' | 'rejected' | 'closed'
    documents: string[]
}