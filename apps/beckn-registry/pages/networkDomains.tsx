import React from 'react'
import CustomTable, { Action } from '../components/CustomTable'
import SearchInput from '../components/SearchInput'
import styles from '../styles/NetworkDomains.module.css'
import ActionHeaders from '../components/actionHeaders'
import en from '../locales/en'
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

type NetworkDomain =
  | {
      name: string
      description: string
      schemaUrl: string
    }
  | { [key: string]: string | number | boolean }

const NetworkDomains: React.FC = () => {
  const data = [
    { name: 'u-test:domain', description: 'test domain', schemaUrl: 'schema-url.com' },
    { name: 'deg:finance', description: 'deg:finance', schemaUrl: '' },
    { name: 'deg:rental', description: 'deg:rental', schemaUrl: '' },
    { name: 'deg:retail', description: 'deg:retail', schemaUrl: '' },
    { name: 'earth_support_initiative', description: 'earth_support_initiative', schemaUrl: '' },
    { name: 'envirogrowth', description: 'envirogrowth', schemaUrl: '' },
    { name: 'state_forest_department', description: 'state_forest_department', schemaUrl: '' },
    { name: 'harmoniaid', description: 'harmoniaid', schemaUrl: '' },
    { name: 'skyanalytics_flow', description: 'skyanalytics_flow', schemaUrl: '' },
    { name: 'dragon_foods', description: 'dragon_foods', schemaUrl: '' },
    { name: 'climate', description: 'climate', schemaUrl: '' },
    { name: 'resilience_climate', description: 'resilience_climate', schemaUrl: '' },
    { name: 'dsep:scholarships', description: 'dsep:scholarships', schemaUrl: '' },
    { name: 'uei:p2p-trading', description: 'uei:p2p-trading', schemaUrl: '' },
    { name: 'uei:p2p_trading', description: 'uei:p2p_trading', schemaUrl: '' }
  ]

  const columns = [
    { header: en.networkDomains.name, accessor: 'name' },
    { header: en.networkDomains.description, accessor: 'description' },
    { header: en.networkDomains.schemaUrl, accessor: 'schemaUrl' }
  ]

  const router = useRouter()

  const handleAddNetworkDomain = () => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'add' } })
  }

  const handleEditNetworkDomain = (networkDomain: NetworkDomain) => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'edit', ...networkDomain } })
  }

  const handleViewNetworkDomain = (networkDomain: NetworkDomain) => {
    router.push({ pathname: '/manageNetworkDomain', query: { mode: 'view', ...networkDomain } })
  }

  const actions: Action[] = [
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
      onClick: row => console.log('Delete', row)
    }
  ]

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

export default NetworkDomains
