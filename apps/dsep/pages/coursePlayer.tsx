import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { Flex, Text } from '@chakra-ui/react'

const CoursePlayer = () => {
  const [domLoaded, setDomLoaded] = useState(false)

  useEffect(() => {
    setDomLoaded(true)
  }, [])

  if (!domLoaded) {
    return <></>
  }
  return (
    <Flex alignItems={'center'} direction="column">
      <ReactPlayer controls height={'auto'} width={'100%'} url="https://www.youtube.com/watch?v=LXb3EKWsInQ" />
      <Text fontWeight={600} fontSize={'20px'}>
        Custom player
      </Text>
    </Flex>
  )
}

export default CoursePlayer
