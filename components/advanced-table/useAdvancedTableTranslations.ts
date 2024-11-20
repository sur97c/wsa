// hooks/useAdvancedTableTranslations.ts

import { useTranslations } from '@hooks/useTranslations';
import {
  Column,
  TableOption,
  RowOption,
  DataItem,
  TableTranslations,
  CellValue
} from '@components/advanced-table/advancedTableDefinition';
import { ModuleWithTableKey, TableTranslationBase } from '../../types/Translation';

interface UseAdvancedTableTranslationsProps {
  module: ModuleWithTableKey;
  entity: string;
}

export function useAdvancedTableTranslations<
  T extends Record<string, CellValue>
>({
  module,
  entity
}: UseAdvancedTableTranslationsProps) {
  const { t, translations } = useTranslations();
  type EntityType = DataItem<T, string>;

  const getEntityTranslations = (): TableTranslationBase | null => {
    const moduleTranslations = translations[module]?.advancedTable;
    if (!moduleTranslations || !(entity in moduleTranslations)) {
      console.warn(`No translations found for entity "${entity}" in module "${module}"`);
      return null;
    }
    return moduleTranslations[entity] as TableTranslationBase;
  };

  const entityTranslations = getEntityTranslations();

  const getTableTranslations = (): TableTranslations => ({
    searchPlaceholder: t('advancedTable.searchPlaceholder'),
    loading: t('advancedTable.loading'),
    noResults: t('advancedTable.noResults'),
    addButton: t('advancedTable.addButton'),
    showingResults: t('advancedTable.showingResults'),
    noMoreData: t('advancedTable.noMoreData'),
    loadingMore: t('advancedTable.loadingMore'),
    page: t('advancedTable.page'),
    actions: t('advancedTable.actions'),
    addEditTitle: t('advancedTable.addEditTitle'),
    save: t('advancedTable.save'),
    cancel: t('advancedTable.cancel'),
    filters: {
      selectColumn: t('advancedTable.filters.selectColumn'),
      selectOperator: t('advancedTable.filters.selectOperator'),
      filterValue: t('advancedTable.filters.filterValue'),
      operators: {
        eq: t('advancedTable.filters.operators.eq'),
        neq: t('advancedTable.filters.operators.neq'),
        gt: t('advancedTable.filters.operators.gt'),
        gte: t('advancedTable.filters.operators.gte'),
        lt: t('advancedTable.filters.operators.lt'),
        lte: t('advancedTable.filters.operators.lte'),
        between: t('advancedTable.filters.operators.between'),
        contains: t('advancedTable.filters.operators.contains')
      },
      minValue: t('advancedTable.filters.minValue'),
      maxValue: t('advancedTable.filters.maxValue'),
      true: t('advancedTable.filters.true'),
      false: t('advancedTable.filters.false'),
      selectOption: t('advancedTable.filters.selectOption'),
      removeFilter: t('advancedTable.filters.removeFilter'),
      dateFormat: t('advancedTable.filters.dateFormat')
    },
    boolean: {
      true: t('advancedTable.boolean.true'),
      false: t('advancedTable.boolean.false')
    }
  });

  const translateColumns = (
    columns: Column<EntityType>[]
  ): Column<EntityType>[] => {
    return columns.map(column => ({
      ...column,
      label: entityTranslations?.columns[String(column.key)] ||
        t(`${module}.advancedTable.${entity}.columns.${String(column.key)}`) ||
        column.label
    }));
  };

  const translateTableOptions = (options: TableOption[]): TableOption[] => {
    return options.map(option => ({
      ...option,
      label: entityTranslations?.tableOptions?.[option.key] ||
        t(`${module}.advancedTable.${entity}.tableOptions.${option.key}`) ||
        option.label
    }));
  };

  const translateRowOptions = (
    options: RowOption<EntityType>[]
  ): RowOption<EntityType>[] => {
    return options.map(option => ({
      ...option,
      label: entityTranslations?.rowOptions?.[option.key] ||
        t(`${module}.advancedTable.${entity}.rowOptions.${option.key}`) ||
        option.label
    }));
  };

  return {
    tableTranslations: getTableTranslations(),
    translateColumns,
    translateTableOptions,
    translateRowOptions
  };
}