// utils/mockData/generators/claimGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import type { IQuote } from '@models/IQuote'
import { BaseMockGenerator } from './baseGenerator'
import { INSURANCE_COMPANIES, POLICY_TYPES } from '../types'

export class QuoteGenerator extends BaseMockGenerator {
    generate(count: number): IQuote[] {
        return Array.from({ length: count }, () => {

            return {
                id: uuidv4(),
                quoteNumber: this.generateRandomString('CLA'),
                clientId: uuidv4(),
                clientName: 'John Doe',
                type: this.getRandomElement(POLICY_TYPES),
                expiresAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                premium: this.getRandomNumber(100, 1000),
                coverage: this.getRandomNumber(100, 1000),
                insuranceCompany: this.getRandomElement(INSURANCE_COMPANIES),
                agent: 'Agent Name',
                status: this.getRandomElement(['draft', 'pending', 'approved', 'rejected', 'converted']),
                createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                createdBy: uuidv4(),
                updatedBy: uuidv4()
            }
        })
    }
}