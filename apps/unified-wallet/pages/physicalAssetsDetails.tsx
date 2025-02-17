import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import ItemRenderer, { ItemMetaData, ORG_NAME_MAP } from '@components/credLayoutRenderer/ItemRenderer'
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
import { AttestationData } from '@lib/types/becknDid'
import ProfileIcon from '@public/images/Profile.svg'

const PhysicalAssetsDetails = () => {
  const [item, setItem] = useState<ItemMetaData>()
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetailsModel>()
  const [attestationsDetails, setAttestationsDetails] = useState<{ name: string; img: string }[]>([
    // { name: 'Open Wallet' },
    // { name: 'Open Spark' }
  ])

  const { t } = useLanguage()
  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [decodeStream, { isLoading }] = useDecodeStreamMutation()

  const getDecodedStreamData = async (data: ItemMetaData) => {
    const decodedRes: any = await decodeStream({ subjectId: data.data.did })
    const details = decodedRes?.data
    console.log('Decoded:', decodedRes)

    setItem({
      ...data,
      title: details?.fileName!,
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
    const result = attestationsDetails?.map((item: any) => {
      return {
        label: item.name,
        img: item.img,
        data_test: '',
        data: item
      }
    })

    return [
      {
        data_test: '',
        details: result
      }
    ]
  }, [attestationsDetails])

  const getAttestationItems = () => {
    const attestations: AttestationData[] = item?.data.attestations
    if (attestations?.length > 0) {
      const result: any = attestations
        .map(attestation => {
          const regex = /\/org\/([^\/]+)\/verification_methods/
          if (attestation.verification_method.did.startsWith(user?.did!)) {
            const orgData = { name: 'Self', icon: ProfileIcon }

            return orgData ? { name: orgData.name, icon: orgData.icon } : null
          }
          if (attestation.verification_method.did.match(regex)) {
            const match = attestation.verification_method.did.match(regex)

            if (!match) return null

            const name = match[1]
            const orgData = ORG_NAME_MAP[name]

            return orgData
              ? {
                  name: orgData.name,
                  img: orgData.icon, //`/images/${orgData.name === 'Vault' ? 'attes_openwallet' : 'attes_openspark'}.svg`,
                  data: attestation
                }
              : null
          }
        })
        .filter(Boolean)
      console.log(result)
      setAttestationsDetails(result)
    }
  }

  useEffect(() => {
    if (item) {
      getAttestationItems()
    }
  }, [item])

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
          attestationsCount={false}
        />
      )}

      {attestationsDetails.length > 0 && (
        <>
          <Typography
            text="Attested By"
            fontSize="16px"
          />
          {getAttestations().map((profile, index) => (
            <DetailCard key={index}>
              {profile.details.map((detail: any, idx: number) => (
                <Box
                  key={idx}
                  onClick={() => {
                    console.log(detail.label)
                    router.push({
                      pathname: '/attestationDetails',
                      query: {
                        cred_name: detail.label,
                        data: JSON.stringify(detail.data)
                      }
                    })
                  }}
                >
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
