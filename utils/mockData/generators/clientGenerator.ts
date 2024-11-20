// utils/mockData/generators/clientGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { BaseMockGenerator } from './baseGenerator'
import type { IClient } from '@models/IClient'
import { LOCATION_DATA, MEXICAN_STATES, type StateAbbr } from '../types'

export class ClientGenerator extends BaseMockGenerator {

    private readonly firstNames = [
        'José', 'María', 'Juan', 'Miguel', 'Carlos', 'Francisco', 'Jorge', 'Ricardo',
        'Manuel', 'Javier', 'Ana', 'Guadalupe', 'Mariana', 'Isabel', 'Patricia',
        'Fernanda', 'Alejandra', 'Rosa', 'Lucía', 'Adriana'
    ];

    private readonly paternalLastNames = [
        'García', 'López', 'Martínez', 'Rodríguez', 'González', 'Hernández', 'Pérez',
        'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Morales', 'Jiménez',
        'Reyes', 'Vázquez', 'Cruz', 'Moreno', 'Ortiz', 'Castillo'
    ];

    private readonly maternalLastNames = [
        'Ruiz', 'Díaz', 'Mendoza', 'Vargas', 'Castillo', 'Morales', 'Santos',
        'Romero', 'Álvarez', 'Méndez', 'Gutiérrez', 'Castro', 'Ortega', 'Silva',
        'Vega', 'Ramos', 'Luna', 'Valencia', 'Chávez', 'Aguilar'
    ];

    private readonly states = [
        { name: 'Ciudad de México', abbr: 'CDMX' },
        { name: 'Estado de México', abbr: 'EDOMEX' },
        { name: 'Jalisco', abbr: 'JAL' },
        { name: 'Nuevo León', abbr: 'NL' },
        { name: 'Puebla', abbr: 'PUE' },
        { name: 'Querétaro', abbr: 'QRO' },
        { name: 'Guanajuato', abbr: 'GTO' },
        { name: 'Veracruz', abbr: 'VER' },
        { name: 'Yucatán', abbr: 'YUC' },
        { name: 'Quintana Roo', abbr: 'QR' }
    ];

    private readonly cities: Record<StateAbbr, string[]> = {
        'CDMX': ['Cuauhtémoc', 'Miguel Hidalgo', 'Benito Juárez', 'Coyoacán'],
        'EDOMEX': ['Naucalpan', 'Tlalnepantla', 'Ecatepec', 'Huixquilucan'],
        'JAL': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Puerto Vallarta'],
        'NL': ['Monterrey', 'San Pedro Garza García', 'San Nicolás', 'Guadalupe'],
        'QRO': ['Querétaro', 'Corregidora', 'El Marqués', 'San Juan del Río']
    } as const;

    private readonly colonies: Record<StateAbbr, string[]> = {
        'CDMX': ['Polanco', 'Condesa', 'Roma Norte', 'Del Valle', 'Santa Fe'],
        'EDOMEX': ['Satélite', 'Lomas Verdes', 'Ciudad Satélite', 'Interlomas'],
        'JAL': ['Providencia', 'Chapalita', 'Americana', 'Ladrón de Guevara'],
        'NL': ['San Jerónimo', 'Cumbres', 'Del Valle', 'Contry'],
        'QRO': ['Jurica', 'Centro', 'El Campanario', 'Juriquilla']
    } as const;

    private readonly occupations = [
        'Ingeniero',
        'Médico',
        'Abogado',
        'Contador',
        'Arquitecto',
        'Profesor',
        'Empresario',
        'Comerciante',
        'Consultor',
        'Ejecutivo de Ventas'
    ];

    private readonly streets = [
        'Av. Insurgentes',
        'Paseo de la Reforma',
        'Av. Revolución',
        'Av. Constituyentes',
        'Calz. de Tlalpan',
        'Av. Universidad',
        'Periférico Sur',
        'Viaducto'
    ];

    private generateRFC(name: string, paternalLastName: string, maternalLastName: string, birthDate: Date): string {
        const lastNameInitial = paternalLastName.charAt(0)
        const firstVowel = paternalLastName.substring(1).match(/[AEIOU]/i)?.[0] || 'X'
        const maternalInitial = maternalLastName.charAt(0)
        const nameInitial = name.charAt(0)
        const year = birthDate.getFullYear().toString().substr(-2)
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0')
        const day = birthDate.getDate().toString().padStart(2, '0')
        const homoclave = Math.random().toString(36).substring(2, 5).toUpperCase()

        return `${lastNameInitial}${firstVowel}${maternalInitial}${nameInitial}${year}${month}${day}${homoclave}`
    }

    private generateCURP(name: string, paternalLastName: string, maternalLastName: string, birthDate: Date, gender: 'M' | 'F' | 'O', state: string): string {
        const rfc = this.generateRFC(name, paternalLastName, maternalLastName, birthDate)
        const genderLetter = gender === 'M' ? 'H' : 'M'
        const stateCode = this.states.find(s => s.name === state)?.abbr.substring(0, 2) || 'DF'
        const consonants = `${paternalLastName}${maternalLastName}${name}`.replace(/[AEIOU]/gi, '')
        const firstConsonant = consonants.charAt(1) || 'X'
        const extraChars = Math.random().toString(36).substring(2, 4).toUpperCase()

        return `${rfc.substring(0, 10)}${genderLetter}${stateCode}${firstConsonant}${extraChars}`
    }

    private generatePhoneNumber(): string {
        const areaCode = ['55', '56', '33', '81', '442'][Math.floor(Math.random() * 5)]
        const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
        return `${areaCode}${number}`
    }

    private getCitiesForState(stateAbbr: StateAbbr): string[] {
        return LOCATION_DATA.cities[stateAbbr] || LOCATION_DATA.cities['CDMX']
    }

    private getColoniesForState(stateAbbr: StateAbbr): string[] {
        return LOCATION_DATA.colonies[stateAbbr] || LOCATION_DATA.colonies['CDMX']
    }

    private generateZipCode(stateAbbr: StateAbbr): string {
        const prefix = LOCATION_DATA.zipCodePrefixes[stateAbbr]
        return `${prefix}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    }

    generate(count: number): IClient[] {
        return Array.from({ length: count }, () => {
            const name = this.getRandomElement(this.firstNames)
            const paternalLastName = this.getRandomElement(this.paternalLastNames)
            const maternalLastName = this.getRandomElement(this.maternalLastNames)
            const birthDate = new Date(
                1960 + Math.floor(Math.random() * 40),
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
            )
            const gender: 'M' | 'F' | 'O' = this.getRandomElement(['M', 'F', 'O'])
            const state = this.getRandomElement(MEXICAN_STATES)

            return {
                id: uuidv4(),
                clientNumber: this.generateRandomString('CLI'),
                name,
                lastName: paternalLastName,
                maternalLastName,
                email: `${name.toLowerCase()}.${paternalLastName.toLowerCase()}@ejemplo.com`,
                phone: this.generatePhoneNumber(),
                address: `${this.getRandomElement(this.streets)} ${this.getRandomNumber(1, 999)}`,
                colony: this.getRandomElement(this.getColoniesForState(state.abbr)),
                city: this.getRandomElement(this.getCitiesForState(state.abbr)),
                state: state.name,
                zipCode: this.generateZipCode(state.abbr),
                rfc: this.generateRFC(name, paternalLastName, maternalLastName, birthDate),
                curp: this.generateCURP(name, paternalLastName, maternalLastName, birthDate, gender, state.name),
                birthDate: birthDate.toISOString(),
                gender,
                occupation: this.getRandomElement(this.occupations),
                createdAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                updatedAt: this.getRandomDate(new Date(2020, 0, 1), new Date()),
                status: this.getRandomElement(['active', 'inactive']),
                createdBy: uuidv4(),
                updatedBy: uuidv4()
            }
        })
    }
}