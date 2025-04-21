import React, { useEffect, useState } from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import styles from '../styles/Users.module.css'
import SearchInput from '../components/SearchInput'
import ActionHeaders from '../components/actionHeaders'
import AlertModal from '../components/AlertModal'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useGetUsersQuery, useDeleteUserMutation } from '../services/userServices'
import { showToast } from '@components/Toast'

export type User = {
  id: string
  username: string
  longName: string
  email: string
  changePassword?: string
  admin: string
  phoneNumber: string
  alternatePhoneNumber?: string
  role: {
    id: string
    name: string
  }
}

type TableRow = { [key: string]: string | number | boolean }

const Users: React.FC = () => {
  const [page] = useState(1)
  const [pageSize] = useState(10)
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
  })

  const { data, isLoading, error } = useGetUsersQuery({ page, pageSize })
  const [deleteUser] = useDeleteUserMutation()

  useEffect(() => {
    if (data && data?.length > 0) {
      setTableData(
        data.map(user => ({
          id: user.documentId,
          username: user.username,
          longName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          alternatePhoneNumber: user.alternatePhoneNumber,
          admin: user.role.type.toLowerCase() === 'admin' ? 'Yes' : 'No'
        }))
      )
    }
  }, [data])

  const columns = [
    { header: en.users.username, accessor: 'username' },
    { header: en.users.longName, accessor: 'longName' },
    { header: en.users.email, accessor: 'email' },
    { header: en.users.phoneNumber, accessor: 'phoneNumber' },
    { header: en.users.alternatePhoneNumber, accessor: 'alternatePhoneNumber' },
    { header: en.users.admin, accessor: 'admin' }
  ]

  const router = useRouter()

  const handleAddUser = () => {
    router.push({ pathname: '/manageUser/user', query: { mode: 'add' } })
  }

  const handleEditUser = (row: TableRow) => {
    router.push({
      pathname: '/manageUser/user',
      query: {
        mode: 'edit',
        id: row.id
      }
    })
  }

  const handleViewUser = (row: TableRow) => {
    router.push({
      pathname: '/manageUser/user',
      query: {
        mode: 'view',
        id: row.id
      }
    })
  }

  const handleDeleteClick = (row: TableRow) => {
    setDeleteModal({
      isOpen: true,
      userId: row.id as string
    })
  }

  const handleDeleteConfirm = async () => {
    console.log('deleteModal', deleteModal)
    if (!deleteModal.userId) return

    try {
      await deleteUser(deleteModal.userId).unwrap()
      showToast({
        message: 'User deleted successfully',
        type: 'success'
      })
      setDeleteModal({ isOpen: false, userId: null })
    } catch (error) {
      showToast({
        message: 'Failed to delete user',
        type: 'error'
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null })
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
      onClick: handleViewUser
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.users.edit,
      onClick: handleEditUser
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.users.delete,
      onClick: handleDeleteClick
    }
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading users</div>
  }

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
          data={tableData}
          actions={actions}
        />
      </div>
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  )
}

export default Users
