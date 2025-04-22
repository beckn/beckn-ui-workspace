import React, { useEffect, useState } from 'react'
import CustomTable, { Action, TableData } from '@components/CustomTable'
import SearchInput from '@components/SearchInput'
import styles from '@styles/NetworkDomains.module.css'
import ActionHeaders from '@components/actionHeaders'
import en from '@locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useDeleteNetworkDomainMutation, useGetNetworkDomainsQuery } from '@services/networkDomainServices'
import { useDispatch } from 'react-redux'
import { setDomains, setPagination, setLoading, setError } from '@store/networkDomain-slice'
import AlertModal from '@components/AlertModal'
import { showToast } from '@components/Toast'

const NetworkDomains: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { data: domains, isLoading, error: queryError, refetch } = useGetNetworkDomainsQuery({ page: 1, pageSize: 100 })
  const [deleteNetworkDomain] = useDeleteNetworkDomainMutation()
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean
    documentId: string | null
  }>({
    isOpen: false,
    documentId: null
  })

  useEffect(() => {
    if (domains) {
      dispatch(setDomains(domains.results))
      dispatch(
        setPagination({
          page: domains.pagination.page,
          pageSize: domains.pagination.pageSize,
          total: domains.pagination.total
        })
      )
    }
    dispatch(setLoading(isLoading))
    if (queryError) {
      dispatch(setError('Failed to fetch network domains'))
    }
  }, [domains, isLoading, queryError, dispatch])

  const columns = [
    { header: en.networkDomains.name, accessor: 'name' },
    { header: en.networkDomains.description, accessor: 'description' },
    { header: en.networkDomains.schemaUrl, accessor: 'schema_url' }
  ]

  const handleSearch = () => {
    refetch()
  }

  // const handlePageChange = (newPage: number) => {
  //   // dispatch(setPagination({ ...pagination, page: newPage }))
  // }

  // const handlePageSizeChange = (newPageSize: number) => {
  //   // dispatch(setPagination({ ...pagination, pageSize: newPageSize, page: 1 }))
  // }

  const handleAddNetworkDomain = () => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'add' } })
  }

  const handleEditNetworkDomain = (networkDomain: TableData) => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'edit', documentId: networkDomain.documentId } })
  }

  const handleViewNetworkDomain = (networkDomain: TableData) => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'view', documentId: networkDomain.documentId } })
  }

  const handleDelete = async (documentId: string) => {
    try {
      await deleteNetworkDomain(documentId).unwrap()
      showToast({
        message: 'Network domain deleted successfully',
        type: 'success'
      })
    } catch (error) {
      showToast({
        message: 'Failed to delete network domain',
        type: 'error'
      })
    }
  }

  const handleDeleteClick = (documentId: string) => {
    setDeleteModalState({
      isOpen: true,
      documentId
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteModalState.documentId) {
      handleDelete(deleteModalState.documentId)
    }
    setDeleteModalState({
      isOpen: false,
      documentId: null
    })
  }

  const handleDeleteCancel = () => {
    setDeleteModalState({
      isOpen: false,
      documentId: null
    })
  }

  const actions: Action<TableData>[] = [
    {
      icon: (
        <FontAwesomeIcon
          icon={faEye}
          color="#3056d3"
        />
      ),
      title: en.networkDomains.view,
      onClick: handleViewNetworkDomain
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faEdit}
          color="#3056d3"
        />
      ),
      title: en.networkDomains.edit,
      onClick: handleEditNetworkDomain
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={faTrashAlt}
          color="#3056d3"
        />
      ),
      title: en.networkDomains.delete,
      onClick: (row: TableData) => handleDeleteClick(row.documentId as string)
    }
  ]

  if (isLoading) {
    return (
      <div className={styles.networkDomainContainer}>
        <ActionHeaders
          onPlusClick={handleAddNetworkDomain}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.networkDomains.title}</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading network domains...</p>
        </div>
      </div>
    )
  }

  if (queryError) {
    return (
      <div className={styles.networkDomainContainer}>
        <ActionHeaders
          onPlusClick={handleAddNetworkDomain}
          onBackClick={() => router.back()}
          onHomeClick={() => router.push('/')}
        />
        <h2 className={styles.title}>{en.networkDomains.title}</h2>
        <div className={styles.errorContainer}>
          <p>Error loading network domains. Please try again later.</p>
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

  return (
    <div className={styles.networkDomainContainer}>
      <ActionHeaders
        onPlusClick={handleAddNetworkDomain}
        onBackClick={() => router.back()}
        onHomeClick={() => router.push('/')}
      />
      <h2 className={styles.title}>{en.networkDomains.title}</h2>
      <SearchInput
        placeholder={en.networkDomains.searchPlaceholder}
        onSearch={handleSearch}
      />
      <div className={styles.tableContainer}>
        <CustomTable
          columns={columns}
          data={domains?.results as unknown as TableData[]}
          actions={actions}
          pagination={{
            currentPage: domains?.pagination.page ?? 1,
            pageSize: domains?.pagination.pageSize ?? 10,
            total: domains?.pagination.total ?? 0,
            onPageChange: (page: number) => console.log('Page changed to', page),
            onPageSizeChange: (pageSize: number) => console.log('Page size changed to', pageSize)
          }}
        />
      </div>
      <AlertModal
        isOpen={deleteModalState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Network Domain"
        message={`Are you sure you want to delete this network domain? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}

export default NetworkDomains
