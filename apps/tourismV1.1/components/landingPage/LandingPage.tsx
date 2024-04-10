import React, { useEffect } from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import Styles from './LandingPage.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { GeoLocationInput } from '../geoLocationInput/GeoLocationInput'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
const LandingPage: React.FC = () => {
  const { t } = useLanguage()
  useEffect(() => {
    localStorage.clear()
  }, [])
  return (
    <Box className={Styles.main_container}>
      <Flex className={Styles.flex_container}>
        <Box className={Styles.heading}>{t.homeHeading}</Box>
        <Box className={Styles.span_text}>{t.headingSpan}</Box>
        <Box className={Styles.para_Text}>
          <Text
            as={Typography}
            text={t.homeText}
            fontSize={'15px'}
            fontWeight={400}
          />
        </Box>
        <Box className={Styles.input_group}>
          <GeoLocationInput />
        </Box>
        <Flex className={Styles.footer_container}>
          <Text
            as={Typography}
            text={t.footerText}
            fontSize={'10px'}
            fontWeight={400}
            color={'#fff'}
          />
          <Image
            src={'./images/beckenFooterLogo.svg'}
            alt="footerLogo"
            width={'39px'}
            height={'13px'}
          />
        </Flex>
      </Flex>
    </Box>
  )
}

export default LandingPage
