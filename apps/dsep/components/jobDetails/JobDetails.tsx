import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../../components/button/Button'
import Router from 'next/router'

const JobDetails = () => {
  const { t } = useLanguage()
  return (
    <Box>
      <Text fontSize={'17px'} fontWeight="600" textAlign={'center'} pb="10px">
        Senior UX Analyst
      </Text>
      <Text fontSize={'15px'} textAlign={'center'}>
        Company Name
      </Text>
      <Box
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
        style={{
          padding: '5px 10px',
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
        handleOnClick={() => {
          Router.push('/jobApply')
        }}
      />
    </Box>
  )
}

export default JobDetails
