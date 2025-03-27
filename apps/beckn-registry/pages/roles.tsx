import React from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import styles from '../styles/Roles.module.css'
import ActionHeaders from '../components/actionHeaders'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

type Role =
  | {
      name: string
      // staff: string
    }
  | { [key: string]: string | number | boolean }

const Roles: React.FC = () => {
  const rolesData = [{ name: 'test-staff' }, { name: 'ADMIN' }, { name: 'USER' }]

  const columns = [
    { header: en.roles.name, accessor: 'name' }
    // { header: en.roles.staff, accessor: 'staff' }
  ]

  const router = useRouter()

  const handleAddRole = () => {
    router.push({ pathname: '/manageRole', query: { mode: 'add' } })
  }

  const handleEditRole = (role: Role) => {
    router.push({ pathname: '/manageRole', query: { mode: 'edit', ...role } })
  }

  const handleViewRole = (role: Role) => {
    router.push({ pathname: '/manageRole', query: { mode: 'view', ...role } })
  }

  const actions: Action[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.roles.view,
      onClick: (row: Role) => handleViewRole(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.roles.edit,
      onClick: (row: Role) => handleEditRole(row)
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.roles.delete,
      onClick: (row: Role) => console.log('Delete', row)
    }
  ]

  return (
    <div className={styles.rolesContainer}>
      <ActionHeaders
        onPlusClick={handleAddRole}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.roles.title}</h2>
      <CustomTable
        columns={columns}
        data={rolesData}
        actions={actions}
      />
    </div>
  )
}

export default Roles
