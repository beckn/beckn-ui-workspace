import { Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Image } from '@chakra-ui/react'
import ItemRenderer, { ItemMetaData, ORG_NAME_MAP } from '@components/credLayoutRenderer/ItemRenderer'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DocIcon from '@public/images/doc_icon.svg'
import { getDocuments, useDecodeStreamMutation, useGetDocumentsMutation } from '@services/walletService'
import { DetailCard } from '@beckn-ui/becknified-components'
import { OwnerDetailsModel } from '@lib/types/profile'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { extractMobileNumberFromSubjectDid } from '@utils/general'
import { AttestationData } from '@lib/types/becknDid'
import MinistryIcon from '@public/images/min_power.svg'
import GovnIcon from '@public/images/gov_ind.svg'

export const ATTES_ORG_NAME_MAP: any = {
  meit: { name: 'Ministry of Power', icon: MinistryIcon },
  mnre: { name: 'B.E.E, Govt. og India', icon: GovnIcon }
}

const AttestationDetails = () => {
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
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()

  const getDecodedStreamData = async (data: ItemMetaData) => {
    console.log(data.data.verification_method.did)
    const match = data.data.verification_method.did.match(/^\/subjects\/org\/[^\/]+/)
    const attestationData: any = await getDocuments(match[0])
    console.log(attestationData.data)
    const decodedRes: any = getAttestationItems(attestationData.data[0].attestations)

    console.log('Decoded:', decodedRes)

    setItem({
      ...data,
      title: 'Wallet License',
      isVerified: true,
      image: DocIcon,
      datetime: new Date().toString(),
      data: { ...data.data, source: null, attachment: null, attestations: decodedRes }
    })
  }
  console.log(attestationsDetails)
  const getUserData = async (name: string) => {
    setOwnerDetails({
      name,
      did: user?.did?.replace('/subjects/', '')!
      //   phoneNumber: extractMobileNumberFromSubjectDid(user?.did!)!
    })
  }

  useEffect(() => {
    const data: any = JSON.parse(router?.query?.data as string)
    if (data) {
      console.log('Data:', data)
      getDecodedStreamData(data)
    }
    getUserData(data?.name || '')
  }, [])

  const profiles = ownerDetails
    ? [
        {
          data_test: '',
          details: [
            { label: ownerDetails?.name, img: '/images/Profile.svg', data_test: '' },
            { label: ownerDetails?.did, img: '/images/Call.svg', data_test: '' }
          ]
        }
      ]
    : []

  const getAttestationItems = (dataItem: any) => {
    console.log(dataItem)
    if (dataItem.length > 0) {
      //   const res = dataItem.map((details: any) => {
      //   const attestations: AttestationData[] = dataItem
      const res = dataItem
        .map((attestation: any) => {
          const regex = /\/org\/([^\/]+)\/verification_methods/
          const match = attestation.verification_method.did.match(regex)
          console.log(match)
          if (!match) return null

          const name = match[1]
          const orgData = ATTES_ORG_NAME_MAP[name]

          return orgData
            ? {
                name: orgData.name,
                img: orgData.icon //`/images/${orgData.name === 'Vault' ? 'attes_openwallet' : 'attes_openspark'}.svg`,
              }
            : null
        })
        .filter(Boolean)
      //   })
      console.log(res)
      return res
    }
  }

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
          allowDeletion={false}
        />
      )}
    </Flex>
  )
}

export default AttestationDetails
