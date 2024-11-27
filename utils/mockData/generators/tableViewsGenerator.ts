// utils/mockData/generators/tableViewsGenerator.ts

import { v4 as uuidv4 } from 'uuid'
import { BaseMockGenerator } from './baseGenerator'
import type { ITableView, ViewConfig, ViewColumnConfig } from '@components/advanced-table/types/view.types'
import type { DataItem } from '@components/advanced-table/types/table.types'

export class TableViewsGenerator extends BaseMockGenerator {
  private readonly viewNames = [
    'Vista Principal',
    'Vista Compacta',
    'Vista Detallada',
    'Vista Personalizada',
    'Vista de Administrador',
    'Vista de Reportes',
    'Vista de Análisis',
    'Vista Resumida',
    'Vista de Auditoría',
    'Vista General'
  ];

  private readonly descriptions = [
    'Muestra los campos más importantes',
    'Formato condensado para mejor visualización',
    'Incluye todos los detalles disponibles',
    'Configuración personalizada de columnas',
    'Vista especial para administradores',
    'Optimizada para reportes y exportación',
    'Enfocada en métricas y análisis',
    'Resumen ejecutivo de datos',
    'Seguimiento de cambios y auditoría',
    'Vista general del sistema'
  ];

  private readonly tables = ['users', 'clients', 'policies', 'claims', 'quotes'];

  private generateColumnConfig(): ViewColumnConfig[] {
    const numColumns = this.getRandomNumber(3, 8)
    return Array.from({ length: numColumns }, (_, index) => ({
      key: `column_${index + 1}`,
      visible: Math.random() > 0.3,
      width: this.getRandomElement(['10%', '15%', '20%', '25%', '30%']),
      order: index
    }))
  }

  private generateViewConfig<T extends DataItem>(): ViewConfig<T> {
    return {
      columns: this.generateColumnConfig(),
      filters: {
        filters: []
      },
      sorting: [
        {
          column: 'column_1',
          direction: this.getRandomElement(['asc', 'desc'])
        }
      ],
      defaultVisibleColumns: ['column_1', 'column_2', 'column_3']
    }
  }

  generate(count: number): ITableView[] {
    return Array.from({ length: count }, (_, index) => {
      const userId = uuidv4()
      const createdAt = this.getRandomDate(new Date(2023, 0, 1), new Date())

      return {
        id: uuidv4(),
        userId,
        tableId: this.getRandomElement(this.tables),
        name: this.getRandomElement(this.viewNames),
        description: this.getRandomElement(this.descriptions),
        isDefault: index === 0, // Solo la primera vista será default
        config: this.generateViewConfig(),
        shared: Math.random() > 0.7,
        permissions: Math.random() > 0.7 ? {
          read: [uuidv4(), uuidv4()],
          write: [uuidv4()]
        } : undefined,
        createdAt: createdAt.toString(),
        updatedAt: this.getRandomDate(new Date(createdAt), new Date()),
        createdBy: userId,
        updatedBy: userId
      }
    })
  }
}