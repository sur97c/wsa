// components/advanced-table/hooks/state/useTableState.ts

import { useState, useCallback, useRef } from 'react'
import { DataItem, TableRecord } from '../../types/table.types'
import { Filter } from '../../types/filter.types'
import { Sort } from '../../types/sort.types'
import { ColumnVisibility } from '../../types/column.types'

export interface TableState<T extends DataItem> {
  data: TableRecord<T>[]
  loading: boolean
  error: string | null
  page: number
  hasMore: boolean
  searchTerm: string
  selectedRows: (string | number)[]
  allSelected: boolean
  sorts: Sort<T>[]                  // Array of active sorts for multi-sorting
  filters: Filter<T>[]
  columnVisibility: ColumnVisibility[]  // Column visibility configuration
  height: number
}

export interface TableStateActions<T extends DataItem> {
  setData: (data: TableRecord<T>[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPage: (page: number) => void
  setHasMore: (hasMore: boolean) => void
  setSearchTerm: (term: string) => void
  setSelectedRows: (rows: (string | number)[]) => void
  toggleSelectAll: () => void
  handleSort: (column: keyof T) => void
  setSorts: (sorts: Sort<T>[]) => void
  addFilter: (filter: Filter<T>) => void
  removeFilter: (index: number) => void
  clearFilters: () => void
  updateVisibleColumns: (columns: string[]) => void
  updateColumnVisibility: (visibility: ColumnVisibility[]) => void
  setHeight: (height: number) => void
  resetState: () => void
}

export function useTableState<T extends DataItem>(
  itemsPerPage: number,
  defaultVisibleColumns: string[]
): [TableState<T>, TableStateActions<T>] {
  // Estado inicial
  const initialState: TableState<T> = {
    data: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    searchTerm: '',
    selectedRows: [],
    allSelected: false,
    sorts: [],
    filters: [],
    columnVisibility: defaultVisibleColumns.map(key => ({
      key,
      label: key,
      visible: true,
      defaultVisible: true
    })),
    height: 0
  }

  // Estados
  const [state, setState] = useState<TableState<T>>(initialState)
  const stateRef = useRef(state)
  stateRef.current = state

  // Acciones
  const setData = useCallback((data: TableRecord<T>[]) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }))
  }, [])

  const setHasMore = useCallback((hasMore: boolean) => {
    setState(prev => ({ ...prev, hasMore }))
  }, [])

  const setSearchTerm = useCallback((searchTerm: string) => {
    setState(prev => ({
      ...prev,
      searchTerm,
      page: 1,
      data: [],
      hasMore: true
    }))
  }, [])

  const setSelectedRows = useCallback((selectedRows: (string | number)[]) => {
    setState(prev => ({
      ...prev,
      selectedRows,
      allSelected: selectedRows.length === prev.data.length
    }))
  }, [])

  const toggleSelectAll = useCallback(() => {
    setState(prev => {
      const allSelected = !prev.allSelected
      return {
        ...prev,
        allSelected,
        selectedRows: allSelected ? prev.data.map(item => item.id) : []
      }
    })
  }, [])

  const handleSort = useCallback((column: keyof T) => {
    setState(prev => {
      const existingSortIndex = prev.sorts.findIndex(sort => sort.columnKey === column)
      let newSorts: Sort<T>[]

      if (existingSortIndex >= 0) {
        // Si ya existe un sort para esta columna, cambiar dirección o remover
        const existingSort = prev.sorts[existingSortIndex]
        if (existingSort.direction === 'asc') {
          newSorts = [...prev.sorts]
          newSorts[existingSortIndex] = { ...existingSort, direction: 'desc' }
        } else {
          newSorts = prev.sorts.filter((_, index) => index !== existingSortIndex)
        }
      } else {
        // Añadir nuevo sort
        const newSort: Sort<T> = {
          columnKey: column,
          direction: 'asc',
          priority: prev.sorts.length
        }
        newSorts = [...prev.sorts, newSort]
      }

      return {
        ...prev,
        sorts: newSorts,
        page: 1,
        data: [],
        hasMore: true
      }
    })
  }, [])

  const addFilter = useCallback((filter: Filter<T>) => {
    setState(prev => ({
      ...prev,
      filters: [...prev.filters, filter],
      page: 1,
      data: [],
      hasMore: true
    }))
  }, [])

  const removeFilter = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index),
      page: 1,
      data: [],
      hasMore: true
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: [],
      page: 1,
      data: [],
      hasMore: true
    }))
  }, [])

  const updateVisibleColumns = useCallback((columns: string[]) => {
    setState(prev => ({
      ...prev,
      columnVisibility: prev.columnVisibility.map(col => ({
        ...col,
        visible: columns.includes(col.key)
      }))
    }))
  }, [])

  const setHeight = useCallback((height: number) => {
    setState(prev => ({ ...prev, height }))
  }, [])

  const resetState = useCallback(() => {
    setState(initialState)
  }, [])

  const setSorts = useCallback((sorts: Sort<T>[]) => {
    setState(prev => ({
      ...prev,
      sorts,
      page: 1,
      data: [],
      hasMore: true
    }))
  }, [])

  const updateColumnVisibility = useCallback((visibility: ColumnVisibility[]) => {
    setState(prev => ({
      ...prev,
      columnVisibility: visibility
    }))
  }, [])

  const actions: TableStateActions<T> = {
    setData,
    setLoading,
    setError,
    setPage,
    setHasMore,
    setSearchTerm,
    setSelectedRows,
    toggleSelectAll,
    handleSort,
    setSorts,
    addFilter,
    removeFilter,
    clearFilters,
    updateVisibleColumns,
    updateColumnVisibility,
    setHeight,
    resetState
  }

  return [state, actions]
}