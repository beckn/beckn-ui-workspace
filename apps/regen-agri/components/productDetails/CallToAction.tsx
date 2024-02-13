import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { HiOutlinePlusSm, HiMinusSm } from 'react-icons/hi'
import { BsCartPlus } from 'react-icons/bs'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import { cartActions } from '../../store/cart-slice'
import { RetailItem } from '../../lib/types/products'
import ProductPrice from '../UI/ProductPrice'
import { toast } from 'react-toastify'
import Button from '../button/Button'
import { Flex } from '@chakra-ui/react'

interface Props {
    product: RetailItem
}
const CallToAction: React.FC<Props> = ({ product }) => {
    const [counter, setCounter] = useState(1)
    const { t } = useLanguage()
    const { theme } = useTheme()

    useEffect(() => {
        return () => {
            setCounter(1)
        }
    }, [product])

    const dispatch = useDispatch()

    function addToCartHandler() {
        dispatch(
            cartActions.addItemToCart({
                product: product,
                quantity: counter,
            })
        )
        toast.success(t.productAddedToCartMsg, {
            theme: theme === 'dark' ? 'dark' : 'light',
        })
    }

    function increment() {
        if (counter < 10) {
            setCounter((prev) => prev + 1)
        }
    }
    function decrement() {
        if (counter > 1) {
            setCounter((prev) => prev - 1)
        }
    }

    function onInputNumberChangeHandler(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
            setCounter(+e.currentTarget.value)
        }
    }

    return (
        <div className="flex flex-col items-center flex-grow sticky top-10 md:top-36 max-w-[350px] mt-8 rtl:mr-auto ltr:ml-auto xl:rtl:ml-2 px-6 py-4 sm:p-4 xl:p-6 border-2 shadow-lg border_radius_all bg-[#fcfbfe]">
            <div className="flex  w-full justify-between items-center ">
                <p className="text-lg">{t.price}</p>
                <ProductPrice
                    price={parseFloat(product.price.value)}
                    isLargeSize={true}
                    currency={product.price.currency}
                />
            </div>
            <div className="flex items-center justify-between mt-6 cursor-pointer">
                <div
                    className="p-2"
                    onClick={increment}
                >
                    <HiOutlinePlusSm style={{ fontSize: '1.5rem' }} />
                </div>
                <input
                    className="inline-block w-[70px] rtl:pr-8 ltr:pl-7 py-2 mx-1 sm:mx-4 border-[1px] border-gray-400 text-center"
                    type="number"
                    min={1}
                    max={10}
                    value={counter}
                    onChange={onInputNumberChangeHandler}
                />
                <div
                    onClick={decrement}
                    className="p-2"
                >
                    <HiMinusSm style={{ fontSize: '1.5rem' }} />
                </div>
            </div>
            <br />
            <Button
                buttonText={t.addToCart}
                type={'solid'}
                isDisabled={false}
                handleOnClick={addToCartHandler}
            />
        </div>
    )
}

export default CallToAction
