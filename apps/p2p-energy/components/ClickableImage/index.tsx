import React from 'react'
import { Image, Link, Box } from '@chakra-ui/react'

interface ClickableImageProps {
  url: string
  imageUrl: string
}

const ClickableImage = (props: ClickableImageProps) => {
  const { url, imageUrl } = props
  return (
    <Link
      href={url}
      isExternal
    >
      <Box
        width="340px"
        height="200px"
        overflow="hidden"
      >
        <Image
          src={imageUrl}
          alt="beckn_bot_image"
          cursor="pointer"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>
    </Link>
  )
}

export default ClickableImage
