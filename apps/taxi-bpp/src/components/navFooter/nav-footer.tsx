'use client'

import styles from './nav-footer.module.scss'
import { getCookie } from '@/lib/CookiesHandler'
import { AppRoutes, LocalKey } from '@/lib/constant'
import { useRouter } from '@/navigation'
import { CarIcon } from '@/lib/icons/car'
import { HomeIcon } from '@/lib/icons/home-icon'
import { ProfileIcon } from '@/lib/icons/profile-icon'

const status = ['Reached Pickup location', 'Started', 'Ended', 'Accepted', 'Reaching Pickup location']

const getRideStatus = () => {
  const { res: rideSummary = {} } = JSON.parse(getCookie(LocalKey.saveActiveRide)) || null
  return status.includes(rideSummary?.DisplayStatus || 'NA')
}
function DriverAppFooter({ title }: any) {
  const router = useRouter()

  const isHomeActive = title === 'Home'

  const AccountActiveColor = () => {
    !getRideStatus() && router.push(AppRoutes.accountRegistration)
  }

  const HomeActiveColor = () => {
    router.push(AppRoutes.driverDashboard)
  }
  return (
    <div className={`${styles.Container} ${styles['fixed-bottom1']}`}>
      <div
        className={styles.homeicon}
        onClick={() => HomeActiveColor()}
      >
        <HomeIcon fill={isHomeActive ? '#3c65f8' : '#00000066'} />
      </div>
      <div className={styles.caricon}>
        <CarIcon fill="black" />
      </div>
      <div
        className={styles.profileicon}
        onClick={() => AccountActiveColor()}
      >
        <ProfileIcon fill={!isHomeActive ? '#9DAFF0' : '#00000066'} />
      </div>
    </div>
  )
}
export default DriverAppFooter
