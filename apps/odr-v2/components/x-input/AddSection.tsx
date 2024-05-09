import React, { useState } from 'react'
import {Box,Flex,Text,useTheme,useDisclosure} from '@chakra-ui/react'
import { PlusSquareIcon,AttachmentIcon } from '@chakra-ui/icons'
import {Typography,BottomModal} from '@beckn-ui/molecules'
import {DetailCard} from '@beckn-ui/becknified-components'
import DyForm from './DyForm'
import { useLanguage } from '@hooks/useLanguage'


interface AddSectionProps  {
	htmlString:string
	form_id:string
	preSubmissionTitle?:string
	postSubmissionTitle?:string
}


const AddSection:React.FC<AddSectionProps> = ({htmlString,form_id,preSubmissionTitle='Add Dispute Details',postSubmissionTitle='Dispute Details added'})=> {

	const {isOpen,onOpen,onClose} = useDisclosure()
	const t = useLanguage()
	const theme = useTheme()
  const bgColorOfPrimary = theme.colors.primary['100']
	const [formSubmitted,setFormSubmitted] = useState<boolean>(false);

	const onSubmit = (submitted)=>{
		setFormSubmitted(submitted)
		onClose()
	}

	const onError = (hasError,error)=>{
		onClose()
	}




	return (
			 <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            {/* <Text fontSize={'17px'}>{t.disputeDetails}</Text> */}
          </Flex>
          <DetailCard>
						{
							!formSubmitted ?
							<Flex
            alignItems={'center'}
            onClick={onOpen}
          >
            <PlusSquareIcon color={bgColorOfPrimary} />
            <Typography
              variant="subTitleRegular"
              text={preSubmissionTitle}
              color={bgColorOfPrimary}
              style={{ paddingLeft: '10px' }}
            />
          </Flex>
							: 
<Flex
            alignItems={'center'}
          >
            <AttachmentIcon  />
            <Typography
              variant="subTitleRegular"
              text={postSubmissionTitle}
              style={{ paddingLeft: '10px' }}
            />
          </Flex>
						}
          
              
          <BottomModal isOpen={isOpen} onClose={onClose}>
            <DyForm htmlForm={htmlString} onSubmit={onSubmit} onError={onError} formId={form_id}  />
          </BottomModal>
          </DetailCard>
        </Box>
	)
}


export default AddSection