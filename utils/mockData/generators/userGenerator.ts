// utils/mockData/generators/userGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { BaseMockGenerator } from './baseGenerator'
import type { IUser } from '@models/IUser'
import type { IProfile } from '@models/IProfile'

export class UserGenerator extends BaseMockGenerator {
    private readonly firstNames = [
        'José', 'María', 'Juan', 'Miguel', 'Carlos', 'Francisco', 'Jorge', 'Ricardo',
        'Manuel', 'Javier', 'Ana', 'Guadalupe', 'Mariana', 'Isabel', 'Patricia',
        'Fernanda', 'Alejandra', 'Rosa', 'Lucía', 'Adriana'
    ]

    private readonly paternalLastNames = [
        'García', 'López', 'Martínez', 'Rodríguez', 'González', 'Hernández', 'Pérez',
        'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez',
        'Reyes', 'Vázquez', 'Cruz', 'Moreno', 'Ortiz', 'Castillo'
    ]

    generate(count: number): (IUser & IProfile)[] {
        return Array.from({ length: count }, () => {
            const firstName = this.getRandomElement(this.firstNames)
            const lastName = this.getRandomElement(this.paternalLastNames)

            return {
                id: uuidv4(),
                uid: uuidv4(),
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ejemplo.com`,
                emailVerified: Math.random() > 0.2,
                displayName: `${firstName} ${lastName}`,
                name: firstName,
                lastName,
                role: this.getRandomElement(['admin', 'agent', 'supervisor', 'user']),
                createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                createdBy: uuidv4(),
                updatedBy: uuidv4(),
                lastSignInTime: new Date().toISOString(),
                status: this.getRandomElement(['active', 'inactive'])
            }
        })
    }
}