import React from 'react'
import Image from 'next/image'
import { urlFor } from '../../../lib/client'
import { RetailItem } from '../../../lib/types/products'
import Link from 'next/link'
import ProductPrice from '../ProductPrice'

interface Props {
    product: RetailItem
}

const CarouselBoxCard: React.FC<Props> = ({ product }) => {
    return (
        <div className="w-full h-full px-2 my-2">
            {/* <Link
        href={`/${product.category[0]}/${product.category[1]}/${product.category[2]}/${product.slug.current}`}
      > */}
            <a className="flex flex-col w-full p-3 shadow-lg backdrop-filter backdrop-blur-[10px] bg-palette-card/80 rounded-md">
                <div className="text-center flex-grow">
                    {product?.descriptor.images[0] && (
                        <Image
                            src={product?.descriptor.images[0]}
                            alt="laptop image"
                            width={200}
                            height={185}
                            className="object-contain hover:scale-105 transition-transform !p-2"
                        />
                    )}
                </div>
                <p className="truncate">{product?.descriptor.name}</p>
                <ProductPrice
                    price={parseFloat(product.price.value)}
                    currency={product.price.currency}
                />
            </a>
            {/* </Link> */}
        </div>
    )
}

export default CarouselBoxCard
