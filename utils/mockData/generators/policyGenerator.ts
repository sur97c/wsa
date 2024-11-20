// utils/mockData/generators/policyGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { BaseMockGenerator } from './baseGenerator'
import { INSURANCE_COMPANIES, POLICY_TYPES } from '../types'
import type { IPolicy } from '@models/IPolicy'

export class PolicyGenerator extends BaseMockGenerator {
    generate(count: number): IPolicy[] {
        return Array.from({ length: count }, () => {

            return {
                id: uuidv4(),
                policyNumber: this.generateRandomString('POL'),
                clientId: uuidv4(),
                clientName: 'John Doe',
                type: this.getRandomElement(POLICY_TYPES),
                status: this.getRandomElement(['active', 'pending', 'cancelled', 'expired']),
                startDate: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                endDate: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                premium: this.getRandomNumber(100, 1000),
                coverage: this.getRandomNumber(100, 1000),
                paymentFrequency: this.getRandomElement(['monthly', 'quarterly', 'annually']),
                insuranceCompany: this.getRandomElement(INSURANCE_COMPANIES),
                createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                createdBy: uuidv4(),
                updatedBy: uuidv4()
            }
        })
    }
}