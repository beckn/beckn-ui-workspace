import React from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import styles from '../styles/Users.module.css'
import SearchInput from '../components/SearchInput'
import ActionHeaders from '../components/actionHeaders'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

type User =
  | {
      username: string
      longName: string
      changePassword: string
      admin: string
      phoneNumber: string
      email: string
      alternatePhoneNumber: string
    }
  | { [key: string]: string | number | boolean }

const Users: React.FC = () => {
  const usersData = [
    {
      username: 'test-user',
      longName: 'test-user',
      changePassword: 'N',
      admin: 'N',
      phoneNumber: '1234567890',
      email: 'email@example.com',
      alternatePhoneNumber: '0987654321'
    },
    {
      username: 'prasad',
      longName: 'Application Administrator',
      changePassword: 'N',
      admin: 'N',
      phoneNumber: '0987654321',
      email: 'email2@example.com',
      alternatePhoneNumber: '1234567890'
    }
  ]

  const columns = [
    { header: en.users.username, accessor: 'username' },
    { header: en.users.longName, accessor: 'longName' },
    { header: en.users.email, accessor: 'email' },
    { header: en.users.phoneNumber, accessor: 'phoneNumber' },
    { header: en.users.alternatePhoneNumber, accessor: 'alternatePhoneNumber' },
    { header: en.users.changePassword, accessor: 'changePassword' },
    { header: en.users.admin, accessor: 'admin' }
  ]

  const router = useRouter()

  const handleAddUser = () => {
    router.push({ pathname: '/manageUser', query: { mode: 'add' } })
  }

  const handleEditUser = (user: User) => {
    router.push({ pathname: '/manageUser', query: { mode: 'edit', ...user } })
  }

  const handleViewUser = (user: User) => {
    router.push({ pathname: '/manageUser', query: { mode: 'view', ...user } })
  }

  const actions: Action[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.users.view,
      onClick: (row: User) => handleViewUser(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.users.edit,
      onClick: (row: User) => handleEditUser(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.users.delete,
      onClick: (row: User) => console.log('Delete', row)
    }
  ]

  return (
    <div className={styles.usersContainer}>
      <ActionHeaders
        onPlusClick={handleAddUser}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.users.title}</h2>
      <SearchInput
        placeholder={en.users.searchPlaceholder}
        onSearch={() => console.log('Search clicked')}
      />
      <div className={styles.tableContainer}>
        <CustomTable
          columns={columns}
          data={usersData}
          actions={actions}
        />
      </div>
    </div>
  )
}

export default Users
