import React, { useEffect, useState } from 'react'
import styles from '@styles/ActionHeaders.module.css'
import { faPlus, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ActionHeaders: React.FC<{ onPlusClick?: () => void; onBackClick?: () => void; onHomeClick?: () => void }> = ({
  onPlusClick,
  onBackClick,
  onHomeClick
}) => {
  const [addButtonVisibility, setAddButtonVisibility] = useState(false)

  useEffect(() => {
    if (onPlusClick) {
      setAddButtonVisibility(true)
    } else {
      setAddButtonVisibility(false)
    }
  }, [onPlusClick])

  const handlePlusClick = () => {
    if (onPlusClick) {
      onPlusClick()
    }
  }

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    }
  }

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick()
    }
  }

  return (
    <div className={styles.actionHeadersContainer}>
      <button
        className={`${styles.actionButton} ${!addButtonVisibility ? styles.hidden : ''}`}
        onClick={handlePlusClick}
        title="Add New"
        disabled={!addButtonVisibility}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <div className={styles.rightIcons}>
        <button
          className={`${styles.actionButton} ${!onBackClick ? styles.hidden : ''}`}
          onClick={handleBackClick}
          title="Go Back"
          disabled={!onBackClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <button
          className={`${styles.actionButton} ${!onHomeClick ? styles.hidden : ''}`}
          onClick={handleHomeClick}
          title="Home"
          disabled={!onHomeClick}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      </div>
    </div>
  )
}

export default ActionHeaders
