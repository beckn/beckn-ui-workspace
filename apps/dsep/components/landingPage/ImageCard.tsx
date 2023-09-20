import React from 'react'
import Styles from './LandingPage.module.css'
import { Image } from '@chakra-ui/react'

interface ImageCardProps {
  image: string
  text: string
  onClick: () => void
  className: string
}

const ImageCard: React.FC<ImageCardProps> = ({ image, text, onClick, className }) => {
  return (
    <div className={Styles.image_container} onClick={onClick}>
      <Image src={image} alt="displayed image" width={35} height={35} />

      <p className={`${Styles.image_text} ${className}`}>{text}</p>
    </div>
  )
}

export default ImageCard
