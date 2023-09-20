import React from 'react'
import { Box, Flex, FormControl, FormLabel, Text } from '@chakra-ui/react'
import Styles from './JobApply.module.css'
import { useLanguage } from '../../hooks/useLanguage'

import Button from '../../components/button/Button'
import UploadFile from '../uploadFile/UploadFile'

const JobApply = () => {
  const { t } = useLanguage()

  return (
    <Box className={Styles.mainContainer} maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <Flex className={Styles.inputConatiner}>
        <FormControl fontSize={'15px'}>
          <FormLabel className={Styles.label}>{t.nameText}</FormLabel>
          <input type="string" className={Styles.input} />
          <div style={{ marginTop: '30px' }}>
            <FormLabel className={Styles.label}>{t.formNumber}</FormLabel>
            <input type="string" className={Styles.input} />
          </div>
          <div style={{ marginTop: '30px' }}>
            <FormLabel className={Styles.label}>{t.formEmail}</FormLabel>
            <input type="string" className={Styles.input} />
          </div>
        </FormControl>
      </Flex>
      <Box pt={'15px'} pb={'20px'}>
        <Text fontSize={'15px'} pt={'30px'} pb={'5px'}>
          {t.docText}
        </Text>
        <UploadFile />
      </Box>
      <Box className={Styles.declareBox} pt={'0px'}>
        <input type="checkbox" />
        <Text pl={'15px'} pt={'16px'}>
          {t.declarationText}
        </Text>
      </Box>

      <Button
        buttonText={t.applyNow}
        color={'rgba(var(--text-color))'}
        background={'rgba(var(--color-primary))'}
        isDisabled
        handleOnClick={() => {}}
      ></Button>
    </Box>
  )
}

export default JobApply
