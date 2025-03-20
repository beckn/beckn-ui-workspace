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
      name: string
      longName: string
      changePassword: string
      admin: string
      numMinutesToKeyExpiration: string
      passwordEncrypted: string
      firstName: string
      lastName: string
      currentLat: string
      currentLng: string
      accountClosureInitiated: string
      accountClosed: string
      notificationEnabled: string
      emailNotificationEnabled: string
      whatsAppNotificationEnabled: string
      phoneNumber: string
      company: string
      lat: string
      lng: string
      addressLine1: string
      addressLine2: string
      addressLine3: string
      addressLine4: string
      city: string
      state: string
      country: string
      pinCode: string
      email: string
      alternatePhoneNumber: string
      staff: string
    }
  | { [key: string]: string | number | boolean }

const Users: React.FC = () => {
  const usersData = [
    {
      name: 'test-user',
      longName: 'test-user',
      changePassword: 'N',
      admin: 'N',
      numMinutesToKeyExpiration: '-1',
      passwordEncrypted: 'N',
      firstName: 'test-user',
      lastName: '',
      currentLat: 'N',
      currentLng: 'N',
      accountClosureInitiated: 'N',
      accountClosed: 'N',
      notificationEnabled: 'Y',
      emailNotificationEnabled: 'Y',
      whatsAppNotificationEnabled: 'N',
      phoneNumber: '1234567890',
      company: 'Company A',
      lat: '12.34',
      lng: '56.78',
      addressLine1: '123 Main St',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      city: 'City A',
      state: 'State A',
      country: 'Country A',
      pinCode: '123456',
      email: 'email@example.com',
      alternatePhoneNumber: '0987654321',
      staff: 'Y'
    },
    {
      name: 'prasad',
      longName: 'Application Administrator',
      changePassword: 'N',
      admin: 'N',
      numMinutesToKeyExpiration: '-171061',
      passwordEncrypted: 'N',
      firstName: 'Application',
      lastName: 'Administrator',
      currentLat: 'N',
      currentLng: 'N',
      accountClosureInitiated: 'N',
      accountClosed: 'N',
      notificationEnabled: 'Y',
      emailNotificationEnabled: 'Y',
      whatsAppNotificationEnabled: 'N',
      phoneNumber: '0987654321',
      company: 'Company B',
      lat: '98.76',
      lng: '54.32',
      addressLine1: '456 Elm St',
      addressLine2: '',
      addressLine3: '',
      addressLine4: '',
      city: 'City B',
      state: 'State B',
      country: 'Country B',
      pinCode: '654321',
      email: 'email2@example.com',
      alternatePhoneNumber: '1234567890',
      staff: 'N'
    }
  ]

  const columns = [
    { header: en.users.name, accessor: 'name' },
    { header: en.users.longName, accessor: 'longName' },
    { header: en.users.changePassword, accessor: 'changePassword' },
    { header: en.users.admin, accessor: 'admin' },
    { header: en.users.numMinutesToKeyExpiration, accessor: 'numMinutesToKeyExpiration' },
    { header: en.users.passwordEncrypted, accessor: 'passwordEncrypted' },
    { header: en.users.firstName, accessor: 'firstName' },
    { header: en.users.lastName, accessor: 'lastName' },
    { header: en.users.currentLat, accessor: 'currentLat' },
    { header: en.users.currentLng, accessor: 'currentLng' },
    { header: en.users.accountClosureInitiated, accessor: 'accountClosureInitiated' },
    { header: en.users.accountClosed, accessor: 'accountClosed' },
    { header: en.users.notificationEnabled, accessor: 'notificationEnabled' },
    { header: en.users.emailNotificationEnabled, accessor: 'emailNotificationEnabled' },
    { header: en.users.whatsAppNotificationEnabled, accessor: 'whatsAppNotificationEnabled' },
    { header: en.users.phoneNumber, accessor: 'phoneNumber' },
    { header: en.users.company, accessor: 'company' },
    { header: en.users.lat, accessor: 'lat' },
    { header: en.users.lng, accessor: 'lng' },
    { header: en.users.addressLine1, accessor: 'addressLine1' },
    { header: en.users.addressLine2, accessor: 'addressLine2' },
    { header: en.users.addressLine3, accessor: 'addressLine3' },
    { header: en.users.addressLine4, accessor: 'addressLine4' },
    { header: en.users.city, accessor: 'city' },
    { header: en.users.state, accessor: 'state' },
    { header: en.users.country, accessor: 'country' },
    { header: en.users.pinCode, accessor: 'pinCode' },
    { header: en.users.email, accessor: 'email' },
    { header: en.users.alternatePhoneNumber, accessor: 'alternatePhoneNumber' },
    { header: en.users.staff, accessor: 'staff' }
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
