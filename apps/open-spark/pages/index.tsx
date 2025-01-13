'use client'

import { ROLE } from '@lib/config'
import { RootState } from '@store/index'
import React from 'react'
import { useSelector } from 'react-redux'
import Dashboard from './dashboard'
import AdminDashbaord from './adminDashboard'

const Homepage = () => {
  const { role } = useSelector((state: RootState) => state.auth)

  return <>{role === ROLE.ADMIN ? <AdminDashbaord /> : <Dashboard />}</>
}

export default Homepage
