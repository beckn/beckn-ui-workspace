import { Box, Text, Button } from '@chakra-ui/react'
import { useState } from 'react'

export interface TextAreaWithReadMoreProps {
  orderPolicyText: string
  readMoreText: string
  readLessText: string
}

const TextAreaWithReadMore: React.FC<TextAreaWithReadMoreProps> = props => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const truncatedText = expanded ? props.orderPolicyText : props.orderPolicyText?.slice(0, 190) + '...'

  return (
    <Box padding={'0 15px'} fontSize={'13px'}>
      <Text
        textOverflow="ellipsis"
        whiteSpace="pre-wrap"
        overflowWrap="break-word"
        noOfLines={expanded ? undefined : 5}
        sx={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: expanded ? 'unset' : 5
        }}
      >
        {truncatedText}
        {!expanded ? (
          <Button
            textDecoration={'none !important'}
            variant="link"
            onClick={toggleExpanded}
            fontSize={'13px'}
            fontWeight={'unset'}
            color={'rgba(var(--color-primary))'}
            pl={'10px'}
          >
            {props.readMoreText}
          </Button>
        ) : (
          <Button
            textDecoration={'none !important'}
            variant="link"
            onClick={toggleExpanded}
            fontSize={'13px'}
            fontWeight={'unset'}
            color={'rgba(var(--color-primary))'}
            pl={'10px'}
          >
            {props.readLessText}
          </Button>
        )}
      </Text>
    </Box>
  )
}

export default TextAreaWithReadMore
