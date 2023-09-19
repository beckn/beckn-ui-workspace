import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../../hooks/useLanguage'
import { RetailItem } from '../../../lib/types/products'
import Button from '../../button/Button'

interface Props {
  product: RetailItem
}

const ScholarshipDetails: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  return (
    <Box>
      <Text fontSize={'17px'} fontWeight="600" textAlign={'center'} pb="10px">
        Extended Learning Scholarship
      </Text>
      <Text fontSize={'15px'} textAlign={'center'}>
        by H.G. Infra Engineering Ltd
      </Text>
      <Box
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
        style={{
          padding: '0px 10px',
          maxHeight: 'calc(100vh - 254px)',
          overflow: 'auto'
        }}
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos eligendi, odio laborum tempore repellat itaque
        quod fugiat pariatur architecto officiis incidunt sunt quas alias saepe eveniet velit excepturi. Modi, sequi?
      </Box>
      <Button
        buttonText={t.applyNow}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {}}
      />
    </Box>
  )
}

export default ScholarshipDetails
