import React from 'react'
import { Badge, Card, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'

interface ClickableCardProps {
  headerIcon: string
  title: string
  description: string
  isNew?: boolean
  backgroundColor?: string
  footerIcon?: string
  handleOnClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
}

const ClickableCard = (props: ClickableCardProps) => {
  const {
    headerIcon,
    title,
    description,
    isNew = false,
    backgroundColor = '#fff',
    handleOnClick,
    footerIcon,
    className
  } = props

  return (
    <>
      <Card
        padding={'10px 20px'}
        backgroundColor={backgroundColor}
        onClick={handleOnClick}
        cursor="pointer"
        border="1px solid transparent"
        _hover={{
          border: '1px solid #212121'
        }}
        className={className}
      >
        <Flex gap={'0.4rem'}>
          <Image
            src={headerIcon}
            alt="chat_icon"
            width={'24px'}
            height={'24px'}
          />
          <Typography
            text={title}
            fontSize="12px"
            fontWeight="600"
            style={{
              alignContent: 'center'
            }}
          />
          {isNew && (
            <Badge
              variant="outline"
              colorScheme="green"
              fontSize={'8px'}
              padding="2px 8px"
              borderRadius={'72px'}
              alignContent="center"
              marginLeft={'0.4rem'}
            >
              New
            </Badge>
          )}
        </Flex>
        <Typography
          text={description}
          fontWeight="400"
          style={{
            padding: '1rem 0'
          }}
        />
        <Flex>
          <Typography
            style={{ paddingRight: '4px', display: 'flex', flexDirection: 'column-reverse' }}
            fontSize="8px"
            fontWeight="400"
            color="#212121"
            text={'Powered By'}
          />
          <Image
            src={footerIcon}
            alt={'card_footer'}
            width={'60px'}
            height={'16px'}
          />
        </Flex>
      </Card>
    </>
  )
}

export default ClickableCard
