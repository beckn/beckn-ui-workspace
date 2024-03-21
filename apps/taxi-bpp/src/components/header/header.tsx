'use client'

import React, { FC } from 'react'
import styles from './header.module.scss'
import { LogOut } from 'react-feather'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { removeCookie } from '@/lib/CookiesHandler'
import { LocalKey } from '@/lib/constant'
import { userLogout } from '../auth/auth-services'
import { useRouter } from '@/navigation'

export interface DriverAppHeaderPropsModel {
  title: string
}

const DriverAppHeader: FC<DriverAppHeaderPropsModel> = ({ title }) => {
  const router = useRouter()
  const logout = () => {
    userLogout('logout', null).then(res => {
      removeCookie(LocalKey.saveApi)
      removeCookie(LocalKey.saveActiveRide)
      //window.localStorage.removeItem(LocalKey.saveApi);
      removeCookie(LocalKey.saveUser)
      // navigate(AppRoutes.admin);
      localStorage.clear()
      router.push('/')
    })
  }
  const renderlogoutTooltip = (props: any) => <Tooltip {...props}>Logout</Tooltip>
  return (
    <>
      <div className={styles['top-bar']}>
        <span>
          {title != 'Home' && (
            <button
              className={styles['back-button']}
              onClick={() => router.back()}
            >
              <span>&#60;</span> Back
            </button>
          )}
        </span>
        <span className="header-push text-white">{title}</span>
        <OverlayTrigger
          placement="left"
          overlay={renderlogoutTooltip}
        >
          <span
            className="header-push"
            title="logout"
          >
            {title === 'Account' && (
              <button
                className={styles['back-button']}
                onClick={logout}
              >
                <span>
                  {' '}
                  <LogOut />
                </span>
              </button>
            )}
          </span>
        </OverlayTrigger>
      </div>
    </>
  )
}

export default DriverAppHeader
