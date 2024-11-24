// components/advanced-table/table.ts

import { CellValue, DataItem } from '@components/advanced-table/advancedTableDefinition'
import { BaseEntity } from '@models/BaseEntity'

export type TableRecord<T extends BaseEntity> = {
    [K in keyof T]: T[K] extends CellValue ? T[K] : CellValue;
} & DataItem & {
    id: string;
    // Aseguramos que todas las propiedades de BaseEntity estén incluidas
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}