import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import ItemRenderer, { ItemMetaData } from '@components/credLayoutRenderer/ItemRenderer'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import DocIcon from '@public/images/doc_icon.svg'
import { useDecodeStreamMutation } from '@services/walletService'
import { DetailCard } from '@beckn-ui/becknified-components'
import { OwnerDetailsModel } from '@lib/types/profile'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { extractMobileNumberFromSubjectDid } from '@utils/general'

const PhysicalAssetsDetails = () => {
  const [item, setItem] = useState<ItemMetaData>()
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsModel>()
  const [attestationsDetails, setAttestationsDetails] = useState<{ name: string }[]>([
    // { name: 'Open Wallet' },
    // { name: 'Open Spark' }
  ])

  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [decodeStream, { isLoading }] = useDecodeStreamMutation()

  const getDecodedStreamData = async (data: ItemMetaData) => {
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    const { fileName } = decodedRes?.data
    console.log('Decoded:', decodedRes)

    setItem({
      ...data,
      title: fileName,
      image: DocIcon,
      data: { ...data.data, source: null, attachment: null }
    })
  }

  const getUserData = async () => {
    setOwnerDetails({ name: '', address: '', phoneNumber: extractMobileNumberFromSubjectDid(user?.did!)! })
  }

  useEffect(() => {
    if (router?.query?.data) {
      const data: ItemMetaData = JSON.parse(router?.query?.data as string)
      console.log('Data:', data)
      getDecodedStreamData(data)
    }
    getUserData()
  }, [])

  const profiles = ownerDetails
    ? [
        {
          data_test: '',
          details: [
            { label: ownerDetails?.name, img: '/images/Profile.svg', data_test: '' },
            { label: ownerDetails?.address, img: '/images/address_loc_icon.svg', data_test: '' },
            { label: ownerDetails?.phoneNumber, img: '/images/Call.svg', data_test: '' }
          ]
        }
      ]
    : []

  const getAttestations = useCallback(() => {
    const result = attestationsDetails.map(item => {
      return {
        label: item.name,
        img: `/images/${item.name === 'Open Wallet' ? 'attes_openwallet' : 'attes_openspark'}.svg`,
        data_test: ''
      }
    })

    return [
      {
        data_test: '',
        details: result
      }
    ]
  }, [attestationsDetails])

  return (
    <Flex
      flexDir={'column'}
      gap="1rem"
    >
      {ownerDetails && (
        <>
          <Typography
            text="Asset Owner Details"
            fontSize="16px"
          />
          {profiles.map((profile, index) => (
            <DetailCard key={index}>
              {profile.details.map((detail, idx) => {
                if (detail.label === '') return <></>
                return (
                  <Box key={idx}>
                    <Flex
                      mt={'18px'}
                      mb="16px"
                      alignItems="center"
                    >
                      <Image
                        height="24px"
                        w="24px"
                        src={detail.img}
                        alt={`${detail.label} icon`}
                        mr="12px"
                      />
                      <Typography
                        variant="subTitleRegular"
                        text={detail.label!}
                        dataTest={detail.data_test}
                      />
                    </Flex>
                    {idx < profile.details.length - 1 && <Divider />}
                  </Box>
                )
              })}
            </DetailCard>
          ))}
        </>
      )}

      <Typography
        text="Documents"
        fontSize="16px"
      />
      {item && (
        <ItemRenderer
          item={item}
          renderMode={'long'}
          handleOnClick={() => {}}
        />
      )}

      {attestationsDetails.length > 0 && (
        <>
          <Typography
            text="Asset Owner Details"
            fontSize="16px"
          />
          {getAttestations().map((profile, index) => (
            <DetailCard key={index}>
              {profile.details.map((detail, idx) => (
                <Box key={idx}>
                  <Flex
                    mt={'18px'}
                    mb="16px"
                    alignItems="center"
                    flexFlow={'row-reverse'}
                    justifyContent={'space-between'}
                  >
                    <Image
                      height="24px"
                      w="24px"
                      src={detail.img}
                      alt={`${detail.label} icon`}
                      mr="12px"
                    />
                    <Typography
                      variant="subTitleRegular"
                      text={detail.label!}
                      dataTest={detail.data_test}
                    />
                  </Flex>
                  {idx < profile.details.length - 1 && <Divider />}
                </Box>
              ))}
            </DetailCard>
          ))}
        </>
      )}
    </Flex>
  )
}

export default PhysicalAssetsDetails
