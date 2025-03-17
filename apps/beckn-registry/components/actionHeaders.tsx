import React from 'react'
import styles from '../styles/ActionHeaders.module.css'
import { faPlus, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ActionHeaders: React.FC<{ onPlusClick?: () => void; onBackClick?: () => void; onHomeClick?: () => void }> = ({
  onPlusClick,
  onBackClick,
  onHomeClick
}) => {
  const handlePlusClick = () => {
    if (onPlusClick) {
      onPlusClick()
    } else {
      console.log('Plus icon clicked')
    }
  }

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      console.log('Back icon clicked')
    }
  }

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick()
    } else {
      console.log('Home icon clicked')
    }
  }

  return (
    <div className={styles.actionHeadersContainer}>
      {onPlusClick && (
        <button
          className={styles.actionButton}
          onClick={handlePlusClick}
          title="Add New"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      )}
      <div className={styles.rightIcons}>
        {onBackClick && (
          <button
            className={styles.actionButton}
            onClick={handleBackClick}
            title="Go Back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {onHomeClick && (
          <button
            className={styles.actionButton}
            onClick={handleHomeClick}
            title="Home"
          >
            <FontAwesomeIcon icon={faHome} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ActionHeaders
