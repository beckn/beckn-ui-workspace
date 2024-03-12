import styles from './dark-layout.module.scss'
import { FC } from 'react'
import { DarkLayoutPropsModel } from '@/types/dark-layout.types'

export const DarkLayout: FC<DarkLayoutPropsModel> = props => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}
