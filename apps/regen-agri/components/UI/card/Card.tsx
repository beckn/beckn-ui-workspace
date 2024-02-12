import React, { useState } from 'react'
import Link from 'next/link'
import StarRatingComponent from 'react-star-rating-component'
import { RetailItem } from '../../../lib/types/products'
import CardActions from './CardActions'
import ProductPrice from '../ProductPrice'
import { toBinary } from '../../../utilities/common-utils'
import { Box, Flex, Text, Image, Divider } from '@chakra-ui/react'
import StarIcon from '../../../public/images/Star.svg'
import greenVegIcon from '../../../public/images/greenVeg.svg'
import redNonVegIcon from '../../../public/images/redNonVeg.svg'
import router from 'next/router'
import Button from '../../button/Button'
import BottomModal from '../../BottomModal/BottomModal'
import { useLanguage } from '../../../hooks/useLanguage'

interface Props {
    product: RetailItem
}

const Card: React.FC<Props> = ({ product }) => {
    const { t } = useLanguage()
    const [termConditionModalOpen, setTermConditionModalOpen] = useState(false)

    const handleOpenModal = () => {
        setTermConditionModalOpen(!termConditionModalOpen)
        localStorage.setItem('selectCardHeaderText', product.descriptor.name)
    }

    const handleCloseModal = () => {
        setTermConditionModalOpen(!termConditionModalOpen)
    }

    const handleOnAcceptAndContinue = () => {
        const encodedProduct = window.btoa(toBinary(JSON.stringify(product)))
        router.push({
            pathname: '/product',
            query: { productDetails: encodedProduct },
        })
    }

    return (
        <Box
            minH={product.tags.foodType ? '138px' : '168px'}
            maxH={'100%'}
            className="col-span-6 sm:col-span-3 md:col-span-4 lg:col-span-3 2xl:col-span-2 shadow-xl my-1 md:my-4 ltr:mr-2 rtl:ml-1 md:mx-6  bg-[#fff] rounded-xl flex relative"
            onClick={handleOpenModal}
        >
            <a className="flex md:items-center md:flex-col relative w-full ">
                <Box
                    w={'125px'}
                    className=" md:w-full relative bg-slate-400/30  md:px-6  rounded-bl-xl rounded-tl-xl md:rounded-tr-xl md:rounded-bl-none rtl:order-2 rtl:md:order-none flex flex-col justify-between items-center"
                >
                    <div className="flex items-center h-full  product-img-span">
                        <Image
                            src={product.descriptor.images[0]}
                            width={'110px'}
                            height={'133px'}
                            alt={product.descriptor.name}
                            className=" drop-shadow-xl object-contain hover:scale-110 transition-transform duration-300 ease-in-out "
                        />
                    </div>
                </Box>
                <Box
                    p={'15px'}
                    pt={'11px'}
                    w={'63%'}
                    position={'relative'}
                    className="flex flex-col md:w-full md:px-3  md:py-4"
                >
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        w={'100%'}
                    >
                        <Text
                            w={'80%'}
                            fontWeight={'600'}
                            fontSize={'15px'}
                            mb={'10px'}
                            noOfLines={2}
                            textOverflow="ellipsis"
                            whiteSpace="pre-wrap"
                            overflowWrap="break-word"
                        >
                            {product.descriptor.name}
                        </Text>

                        {product.tags.foodType ? (
                            product.tags.foodType === 'veg' ? (
                                <Image
                                    pt={'4px'}
                                    src={greenVegIcon}
                                    alt="greenVegIcon"
                                />
                            ) : (
                                <Image
                                    pt={'4px'}
                                    src={redNonVegIcon}
                                    alt="nonVegIcon"
                                />
                            )
                        ) : null}
                    </Flex>

                    <Flex
                        fontSize={'12px'}
                        alignItems={'center'}
                        mb={'8px'}
                    >
                        <Text fontWeight={'600'}>Sold by:</Text>
                        <Text pl={'3px'}>{(product as any).bppName}</Text>
                    </Flex>
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        position={'absolute'}
                        bottom={'11px'}
                        width={'calc(100% - 30px)'}
                    >
                        <ProductPrice
                            currency={product.price.currency}
                            price={parseFloat(product.price.value)}
                        />
                        {product?.tags?.rating && (
                            <Flex alignItems={'center'}>
                                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                                <Image src={StarIcon} />
                                <Text
                                    fontSize={'12px'}
                                    pl={'5px'}
                                >
                                    {product.tags.rating}
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                </Box>
            </a>

            <CardActions product={product} />

            <Flex>
                <BottomModal
                    isOpen={termConditionModalOpen}
                    onClose={handleCloseModal}
                >
                    <Text mb={'5px'}>{t.termCondition}</Text>
                    <Divider />
                    <Text m={'15px 0px'}>{t.termConditionText}</Text>
                    <Box>
                        <Button
                            buttonText={'Accept & Continue'}
                            isDisabled={false}
                            type={'solid'}
                            handleOnClick={handleOnAcceptAndContinue}
                        />
                        <Button
                            buttonText={'Cancel'}
                            isDisabled={false}
                            type={'outline'}
                            handleOnClick={handleCloseModal}
                        />
                    </Box>
                </BottomModal>
            </Flex>
        </Box>
    )
}

export default Card
