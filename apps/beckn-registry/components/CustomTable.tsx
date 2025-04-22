import React, { useState } from 'react'
import styles from '../styles/CustomTable.module.css'

export type TableData = { [key: string]: string | number | boolean }

export type Action<T> = {
  icon: string | React.ReactNode
  title: string
  onClick: (row: T) => void
}

interface TableProps<T> {
  columns: { header: string; accessor: keyof T }[]
  data: T[]
  actions?: Action<T>[]
  isLoading?: boolean
  pagination?: {
    currentPage: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
}

const CustomTable = <T extends Record<string, string | number | boolean>>({
  columns,
  data,
  actions,
  isLoading,
  pagination
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return data
  }, [data, sortConfig])

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {actions && <th></th>}
            {columns.map((col, index) => (
              <th key={index}>
                <div className={styles.headerContainer}>
                  {col.header}
                  <div
                    className={styles.arrowContainer}
                    onClick={() => requestSort(col.accessor)}
                  >
                    <span className={styles.arrow}>{'▲'}</span>
                    <span className={styles.arrow}>{'▼'}</span>
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className={styles.loadingCell}
              >
                Loading...
              </td>
            </tr>
          ) : (
            sortedData?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {actions && (
                  <td>
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className={styles.iconButton}
                        title={action.title}
                        onClick={() => action.onClick(row)}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </td>
                )}
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col.accessor]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className={styles.pagination}>
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === Math.ceil(pagination.total / pagination.pageSize)}
          >
            Next
          </button>
          <select
            value={pagination.pageSize}
            onChange={e => pagination.onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}
    </div>
  )
}

export default CustomTable
