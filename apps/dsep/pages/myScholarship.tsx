import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import Button from '../components/button/Button'
import ScholarshipCard from '../components/scholarship/scholarshipCard/ScholarshipCard'
import ScholarshipListCard from '../components/scholarship/scholarshipCard/scholarshipListCard'
import ScholarshipDetails from '../components/scholarship/scholarshipDetails/ScholarshipDetails'
import { useLanguage } from '../hooks/useLanguage'
import { RetailItem } from '../lib/types/products'

interface Props {
  product: RetailItem
}

const myScholarship: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const [status, setStatus] = useState(true)

  const handleScholarship = () => {
    Router.push('/myScholarship')
  }

  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <ScholarshipCard
        heading={'Scholarship Name Placeholder Text'}
        time={'21st Jun 2021, 3.30pm'}
        id={'789171'}
        img={status ? '/images/inProgress.svg' : '/images/approvedIcon.svg'}
        review={'In Review'}
        isStatus={status}
        addScholarshipCard={() => {}}
      />
      <Button
        buttonText={t.searchMoreScholarships}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleScholarship}
      />
      {/* <ScholarshipListCard
        scholarshipName={'Scholarship Name Placeholder Text'}
        scholarshipDetails={'Extended learning scholarship for design placeholder description text for very brief...'}
        scholarshipBy={'ShopNotch'}
        handleCardClick={() => {}}
      /> */}
      {/* <ScholarshipDetails product={product} /> */}
    </Box>
  )
}

export default myScholarship
