import { ChangeEventHandler, FC } from 'react'

export interface CustomSwitchPropsModel {
  isOn: boolean
  handleToggle: ChangeEventHandler<HTMLInputElement>
}

import styles from './switchButton.module.scss'

const CustomSwitch: FC<CustomSwitchPropsModel> = ({ isOn, handleToggle }) => {
  return (
    <>
      <label
        className={styles.switch}
        htmlFor={`react-switch-new`}
      >
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          id={`react-switch-new`}
        />
        <span className={`${styles.slider} ${styles.round}`} />
        <h3 className={styles.textav}>{isOn ? 'Available' : 'Offline'}</h3>
      </label>
    </>
  )
}

export default CustomSwitch
