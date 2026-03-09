import { Typography } from '@beckn-ui/molecules'
import React from 'react'
import Image from 'next/image'

const EmptyScreenTemplate = ({ text, description, src }: { text: string; description?: string; src: string }) => {
  return (
    <div className="flex flex-col gap-4 py-8 justify-self-center">
      <Image
        src={src}
        alt=""
        width={120}
        height={120}
        className="self-center"
        data-testid="empty-img"
      />
      <Typography
        fontSize="12px"
        fontWeight="500"
        sx={{ textAlign: 'center', color: '#4D4D4D' }}
        text={text}
        dataTest="emptyText"
      />
      <Typography
        style={{ textAlign: 'center', margin: '0 auto' }}
        fontSize="10px"
        fontWeight="400"
        sx={{ textAlign: 'center', color: '#8B8B8B', lineHeight: '16px', width: '14rem' }}
        text={description}
        dataTest="emptyTextDesc"
      />
    </div>
  )
}

export default EmptyScreenTemplate
