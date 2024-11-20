// utils/mockData/types/index.ts

export const STATE_ABBREVIATIONS = ['CDMX', 'EDOMEX', 'JAL', 'NL', 'QRO'] as const

export type StateAbbr = typeof STATE_ABBREVIATIONS[number]

export interface StateInfo {
    name: string
    abbr: StateAbbr
}

export interface LocationData {
    cities: Record<StateAbbr, string[]>
    colonies: Record<StateAbbr, string[]>
    zipCodePrefixes: Record<StateAbbr, string>
}

export const MEXICAN_STATES: StateInfo[] = [
    { name: 'Ciudad de México', abbr: 'CDMX' },
    { name: 'Estado de México', abbr: 'EDOMEX' },
    { name: 'Jalisco', abbr: 'JAL' },
    { name: 'Nuevo León', abbr: 'NL' },
    { name: 'Querétaro', abbr: 'QRO' }
]

export const LOCATION_DATA: LocationData = {
    cities: {
        'CDMX': ['Cuauhtémoc', 'Miguel Hidalgo', 'Benito Juárez', 'Coyoacán'],
        'EDOMEX': ['Naucalpan', 'Tlalnepantla', 'Ecatepec', 'Huixquilucan'],
        'JAL': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Puerto Vallarta'],
        'NL': ['Monterrey', 'San Pedro Garza García', 'San Nicolás', 'Guadalupe'],
        'QRO': ['Querétaro', 'Corregidora', 'El Marqués', 'San Juan del Río']
    },
    colonies: {
        'CDMX': ['Polanco', 'Condesa', 'Roma Norte', 'Del Valle', 'Santa Fe'],
        'EDOMEX': ['Satélite', 'Lomas Verdes', 'Ciudad Satélite', 'Interlomas'],
        'JAL': ['Providencia', 'Chapalita', 'Americana', 'Ladrón de Guevara'],
        'NL': ['San Jerónimo', 'Cumbres', 'Del Valle', 'Contry'],
        'QRO': ['Jurica', 'Centro', 'El Campanario', 'Juriquilla']
    },
    zipCodePrefixes: {
        'CDMX': '06',
        'EDOMEX': '52',
        'JAL': '44',
        'NL': '64',
        'QRO': '76'
    }
}

export const INSURANCE_COMPANIES = [
    'GNP Seguros',
    'Qualitas',
    'AXA Seguros',
    'Mapfre',
    'HDI Seguros',
    'Zurich',
    'Afirme',
    'Banorte Seguros'
]

export const POLICY_TYPES = [
    'Auto Individual',
    'Auto Flotilla',
    'Hogar',
    'Vida',
    'Gastos Médicos Mayores',
    'Empresarial',
    'RC Profesional',
    'Accidentes Personales'
]
