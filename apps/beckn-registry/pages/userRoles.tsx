import React from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import SearchInput from '../components/SearchInput'
import styles from '../styles/UserRoles.module.css'
import ActionHeaders from '../components/actionHeaders'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

type UserRole =
  | {
      user: string
      role: string
    }
  | { [key: string]: string | number | boolean }

const UserRoles: React.FC = () => {
  const router = useRouter()

  const data = [
    { user: 'test-user', role: 'test-staff' },
    { user: 'Application Administrator', role: 'ADMIN' }
  ]

  const columns = [
    { header: en.userRoles.user, accessor: 'user' },
    { header: en.userRoles.role, accessor: 'role' }
  ]

  const actions: Action[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.userRoles.view,
      onClick: (row: UserRole) => handleViewUserRole(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.userRoles.edit,
      onClick: (row: UserRole) => handleEditUserRole(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.userRoles.delete,
      onClick: (row: UserRole) => console.log('Delete', row)
    }
  ]

  const handleAddUserRole = () => {
    router.push({ pathname: '/manageUserRole', query: { mode: 'add' } })
  }

  const handleEditUserRole = (userRole: UserRole) => {
    router.push({ pathname: '/manageUserRole', query: { mode: 'edit', ...userRole } })
  }

  const handleViewUserRole = (userRole: UserRole) => {
    router.push({ pathname: '/manageUserRole', query: { mode: 'view', ...userRole } })
  }

  return (
    <div className={styles.userRolesContainer}>
      <ActionHeaders
        onPlusClick={handleAddUserRole}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.userRoles.title}</h2>
      <SearchInput
        placeholder={en.userRoles.searchPlaceholder}
        onSearch={() => console.log('Search clicked')}
      />
      <div className={styles.tableContainer}>
        <CustomTable
          columns={columns}
          data={data}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default UserRoles
