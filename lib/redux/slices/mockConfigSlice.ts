// lib/redux/slices/mockConfigSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type EntityName = 'users' | 'clients' | 'policies' | 'claims' | 'quotes'

interface MockConfigState {
  useMockData: boolean
  mockEntities: Record<EntityName, boolean>
}

// Obtener la configuración del entorno
const getInitialMockConfig = (): boolean => {
  // Prioridad 1: Variable de entorno específica para mock data
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== undefined) {
    return process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  }
  // Prioridad 2: Basado en el entorno (development usa mocks por defecto)
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  // Prioridad 3: Valor por defecto (false para producción)
  return false
}

const initialState: MockConfigState = {
  useMockData: getInitialMockConfig(),
  mockEntities: {
    users: getInitialMockConfig(),
    clients: getInitialMockConfig(),
    policies: getInitialMockConfig(),
    claims: getInitialMockConfig(),
    quotes: getInitialMockConfig()
  }
}

const mockConfigSlice = createSlice({
  name: 'mockConfig',
  initialState,
  reducers: {
    setGlobalMockConfig(state, action: PayloadAction<boolean>) {
      state.useMockData = action.payload
      // Actualiza todas las entidades
      Object.keys(state.mockEntities).forEach(key => {
        state.mockEntities[key as EntityName] = action.payload
      })
    },
    setEntityMockConfig(
      state,
      action: PayloadAction<{ entity: EntityName; useMock: boolean }>
    ) {
      state.mockEntities[action.payload.entity] = action.payload.useMock
    },
    resetMockConfig(state) {
      state.useMockData = getInitialMockConfig()
      Object.keys(state.mockEntities).forEach(key => {
        state.mockEntities[key as EntityName] = getInitialMockConfig()
      })
    }
  }
})

export const { setGlobalMockConfig, setEntityMockConfig, resetMockConfig } = mockConfigSlice.actions
export default mockConfigSlice.reducer