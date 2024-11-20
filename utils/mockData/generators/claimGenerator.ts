// utils/mockData/generators/claimGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { BaseMockGenerator } from './baseGenerator'
import { POLICY_TYPES } from '../types'
import type { IClaim } from '@models/IClaim'

export class ClaimGenerator extends BaseMockGenerator {
    generate(count: number): IClaim[] {
        return Array.from({ length: count }, () => {

            return {
                id: uuidv4(),
                claimNumber: this.generateRandomString('CLA'),
                policyId: uuidv4(),
                policyNumber: this.generateRandomString('POL'),
                clientId: uuidv4(),
                clientName: 'John Doe',
                type: this.getRandomElement(POLICY_TYPES),
                description: 'Description of the claim',
                amount: this.getRandomNumber(100, 1000),
                dateOfIncident: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                dateSubmitted: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                dateResolved: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                adjuster: 'Adjuster Name',
                status: this.getRandomElement(['new', 'in_progress', 'pending_info', 'approved', 'rejected', 'closed']),
                documents: [],
                createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                createdBy: uuidv4(),
                updatedBy: uuidv4()
            }
        })
    }
}