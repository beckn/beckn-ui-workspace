import React from 'react'
import styles from '../styles/Dropdown.module.css'

interface DropdownProps {
  label: string
  options: { name: string; handleClick: () => void }[]
  isActive: boolean
  onToggle: () => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, isActive, onToggle }) => {
  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownButton}
        onClick={onToggle}
      >
        {label} <span className={styles.arrow}>{isActive ? '▲' : '▼'}</span>
      </button>
      {isActive && (
        <ul className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.dropdownItem}
              onClick={option.handleClick}
            >
              <div>{option.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
