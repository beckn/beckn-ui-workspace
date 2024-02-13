import React from 'react'
import { RetailItem } from '../../lib/types/products'
import CarouselBox from '../UI/CarouselBox/CarouselBox'
import CarouselBoxCard from '../UI/CarouselBox/CarouselBoxCard'

interface Props {
    products: RetailItem[]
}
const SimilarProducts: React.FC<Props> = ({ products }) => {
    return (
        <div>
            <CarouselBox
                title="similarProducts"
                full={true}
            >
                {products.map((product) => (
                    <CarouselBoxCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </CarouselBox>
        </div>
    )
}

export default SimilarProducts
