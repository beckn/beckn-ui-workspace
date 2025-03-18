import React, { useState } from 'react'
import styles from '../styles/CustomTable.module.css'

export type Action = {
  icon: string | React.ReactNode
  title: string
  onClick: (row: { [key: string]: string | number | boolean }) => void
}

interface TableProps {
  columns: { header: string; accessor: string }[]
  data: Array<{ [key: string]: string | number | boolean }>
  actions?: Action[]
}

const CustomTable: React.FC<TableProps> = ({ columns, data, actions }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

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

  const requestSort = (key: string) => {
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
          {sortedData.map((row, rowIndex) => (
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
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
