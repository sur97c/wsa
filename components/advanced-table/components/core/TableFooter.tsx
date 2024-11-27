// components/advanced-table/components/core/TableFooter.tsx

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import type { TableTranslations } from '@components/advanced-table/types/translation.types'
import clsx from 'clsx'

interface TableFooterProps {
  itemCount: number
  page: number
  loading: boolean
  hasMore: boolean
  translations: TableTranslations
  containerWidth?: number
  className?: string
}

const TableFooter: React.FC<TableFooterProps> = ({
  itemCount,
  page,
  loading,
  hasMore,
  translations,
  containerWidth,
  className
}) => {
  const renderContent = () => {
    // No hay datos aún pero está cargando
    if (itemCount === 0 && loading) {
      return (
        <div className="flex items-center justify-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400" />
        </div>
      )
    }

    // No hay resultados
    if (itemCount === 0 && !loading) {
      return (
        <div className="text-gray-500 text-sm text-center">
          {translations.noResults}
        </div>
      )
    }

    // Hay datos, mostrar información
    return (
      <div className="grid grid-cols-3 items-center">
        {/* Información de resultados */}
        <div className="text-gray-500 text-sm">
          {translations.showingResults
            .replace('{{count}}', itemCount.toString())
            .replace('{{page}}', page.toString())}
        </div>

        {/* Indicador de carga */}
        <div className="flex justify-center">
          {loading && (
            <FontAwesomeIcon 
              icon={faSpinner} 
              spin 
              className="text-gray-400" 
            />
          )}
        </div>

        {/* Estado de paginación */}
        <div className="text-right text-gray-500 text-sm">
          {!hasMore && itemCount > 0 && translations.noMoreData}
          {loading && hasMore && translations.loadingMore}
        </div>
      </div>
    )
  }

  return (
    <div 
      className={clsx(
        'px-4 py-3 bg-white border-t border-gray-200',
        className
      )}
      style={containerWidth ? { width: containerWidth } : undefined}
    >
      {renderContent()}
    </div>
  )
}

export default TableFooter