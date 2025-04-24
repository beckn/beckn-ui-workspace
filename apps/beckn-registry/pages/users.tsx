import React, { useEffect, useState } from 'react'
import CustomTable, { Action, TableData } from '@components/CustomTable'
import styles from '@styles/Users.module.css'
import SearchInput from '@components/SearchInput'
import ActionHeaders from '@components/actionHeaders'
import AlertModal from '@components/AlertModal'
import en from '@locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useGetUsersQuery, useDeleteUserMutation } from '@services/userServices'
import { showToast } from '@components/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { setUsers, setPagination, setLoading, setError } from '@store/user-slice'
import { RootState } from '@store/index'
import UnauthorizedAccess from '@components/UnauthorizedAccess'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

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

const Users: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([])
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
  })

  const dispatch = useDispatch()
  const { pagination } = useSelector((state: RootState) => state.user)
  const { user } = useSelector((state: RootState) => state.auth)
  const isAdmin = user?.role?.type.toLowerCase() === 'admin'
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1)
  const [currentPageSize, setCurrentPageSize] = useState(pagination?.pageSize || 10)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: users,
    isLoading,
    error: queryError,
    refetch
  } = useGetUsersQuery({
    page: currentPage,
    pageSize: currentPageSize,
    searchQuery: searchQuery.trim() || undefined
  })
  const [deleteUser, { error: deleteError }] = useDeleteUserMutation()

  useEffect(() => {
    if (users) {
      dispatch(setUsers(users.results))
      dispatch(
        setPagination({
          page: Number(users.pagination.page),
          pageSize: Number(users.pagination.pageSize),
          total: Number(users.pagination.total)
        })
      )

      setTableData(
        users.results.map(user => ({
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
    dispatch(setLoading(isLoading))
    if (queryError) {
      const error = queryError as FetchBaseQueryError
      if (error.status === 401) {
        return
      }
      dispatch(setError('Failed to fetch users'))
    }
  }, [users, isLoading, queryError, dispatch])

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

  const handleEditUser = (row: TableData) => {
    router.push({
      pathname: '/manageUser/user',
      query: {
        mode: 'edit',
        id: row.id as string
      }
    })
  }

  const handleViewUser = (row: TableData) => {
    router.push({
      pathname: '/manageUser/user',
      query: {
        mode: 'view',
        id: row.id as string
      }
    })
  }

  const handleDeleteClick = (row: TableData) => {
    setDeleteModal({
      isOpen: true,
      userId: row.id as string
    })
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    refetch()
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.userId) return

    try {
      await deleteUser(deleteModal.userId).unwrap()
      showToast({
        message: 'User deleted successfully',
        type: 'success'
      })
      setDeleteModal({ isOpen: false, userId: null })
      refetch()
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setCurrentPageSize(newPageSize)
    setCurrentPage(1)
  }

  const actions: Action<TableData>[] = [
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

  const error = (queryError as FetchBaseQueryError) || (deleteError as FetchBaseQueryError)

  if (isLoading) {
    return (
      <div className={styles.usersContainer}>
        <ActionHeaders
          onPlusClick={isAdmin ? handleAddUser : undefined}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.users.title}</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  if (queryError) {
    return (
      <div className={styles.usersContainer}>
        <ActionHeaders
          onPlusClick={isAdmin ? handleAddUser : undefined}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.users.title}</h2>
        <div className={styles.errorContainer}>
          <p>Error loading users. Please try again later.</p>
          <button
            onClick={() => refetch()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (users && users?.results.length === 0) {
    return (
      <div className={styles.usersContainer}>
        <ActionHeaders
          onPlusClick={handleAddUser}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.users.title}</h2>
        <div className={styles.emptyContainer}>
          <p>No users found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.usersContainer}>
      <ActionHeaders
        onPlusClick={isAdmin ? handleAddUser : undefined}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.users.title}</h2>
      <SearchInput
        placeholder={en.users.searchPlaceholder}
        onSearch={(query: string) => handleSearch(query)}
      />
      <div className={styles.tableContainer}>
        <CustomTable
          columns={columns}
          data={tableData}
          actions={actions}
          pagination={{
            currentPage: currentPage,
            pageSize: currentPageSize,
            total: pagination?.total || 1,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange
          }}
        />
      </div>
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
      {error?.status === 401 && (
        <UnauthorizedAccess
          onRetry={refetch}
          closeButton={true}
        />
      )}
    </div>
  )
}

export default Users
