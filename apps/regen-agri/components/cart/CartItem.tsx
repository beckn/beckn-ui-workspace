import Image from 'next/image'
import React, { useState } from 'react'
import { HiMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useLanguage } from '../../hooks/useLanguage'
import useRequest from '../../hooks/useRequest'
import {
    CartItemForRequest,
    DataPerBpp,
    ICartRootState,
    TransactionIdRootState,
} from '../../lib/types/cart'
import { RetailItem } from '../../lib/types/products'
import { cartActions } from '../../store/cart-slice'
import {
    getCartItemsPerBpp,
    getPayloadForQuoteRequest,
} from '../../utilities/cart-utils'
import ProductPrice from '../UI/ProductPrice'

interface Props {
    product: RetailItem
    setIsLoadingForCartCountChange: Function
}
const CartItem: React.FC<Props> = ({
    product,
    setIsLoadingForCartCountChange,
}) => {
    const quoteRequest = useRequest()
    const cartItems = useSelector((state: ICartRootState) => state.cart.items)
    const transactionId = useSelector(
        (state: { transactionId: TransactionIdRootState }) =>
            state.transactionId
    )
    const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(
        cartItems as CartItemForRequest[]
    )
    const payLoadForQuoteRequest = getPayloadForQuoteRequest(
        cartItemsPerBppPerProvider,
        transactionId
    )
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    const productQuantity = useSelector(
        (state: ICartRootState) =>
            state.cart.items.find((item) => item.id === product.id)?.quantity
    )
    const [counter, setCounter] = useState(productQuantity)
    const dispatch = useDispatch()
    const { t } = useLanguage()

    const fetchQuotes = () => {
        setIsLoadingForCartCountChange(true)
        quoteRequest
            .fetchData(
                `${apiUrl}/client/v2/get_quote`,
                'POST',
                payLoadForQuoteRequest
            )
            .then((data) => setIsLoadingForCartCountChange(false))
            .catch((e) => console.error(e))
    }

    function increment(product: RetailItem) {
        setCounter((prev) => ++prev!)
        dispatch(cartActions.addItemToCart({ product: product, quantity: 1 }))
        fetchQuotes()
    }

    function decrement(slug: string) {
        setCounter((prev) => --prev!)
        dispatch(cartActions.removeItemFromCart(slug))
        fetchQuotes()
    }

    function onInputNumberChangeHandler(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        if (+e.currentTarget.value >= 1 && +e.currentTarget.value <= 10) {
            setCounter(+e.currentTarget.value)
        }
    }

    return (
        <div className="flex items-center flex-wrap sm:my-4 sm:py-4 px-2 border-b-2 mb-4">
            <div
                style={{ width: '100%' }}
                className="lg:w-1/2 sm:min-w-[290px]"
            >
                {/* <Link
          href={`/${product.category[0]}/${product.category[1]}/${product.category[2]}/${product.slug.current}`}
        > */}
                <a className="flex flex-wrap sm:flex-nowrap justify-center items-center flex-grow">
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            marginBottom: '5px',
                        }}
                    >
                        <Image
                            src={product.descriptor.images[0]}
                            width={200}
                            height={200}
                            alt={product.descriptor.name}
                            className="object-contain"
                        />
                    </div>
                    <div
                        className="flex-grow text-sm font-semibold mb-2 sm:mb-0 mx-2 w-full text-center pt-1"
                        style={{ direction: 'ltr', fontSize: '17px' }}
                    >
                        {product.descriptor.name}
                    </div>
                </a>
                {/* </Link> */}
            </div>
            <div className="flex flex-wrap flex-grow md:items-center mb-4 sm:mb-0">
                <div className="flex-grow my-2 sm:my-0">
                    <div className="flex items-center justify-start lg:justify-center cursor-pointer">
                        <div
                            className="p-2"
                            onClick={() => increment(product)}
                        >
                            <HiOutlinePlusSm style={{ fontSize: '1rem' }} />
                        </div>
                        <input
                            className="inline-block w-[65px] rtl:pr-7 ltr:pl-7 py-2 mx-1 border-[1px] border-gray-400 text-center border_radius_all"
                            type="number"
                            min={1}
                            max={10}
                            value={counter}
                            onChange={onInputNumberChangeHandler}
                        />
                        {counter === 1 ? (
                            <div
                                onClick={() => decrement(product.id)}
                                className="p-1"
                            >
                                <HiOutlineTrash
                                    style={{ fontSize: '1.3rem', color: 'red' }}
                                />
                            </div>
                        ) : (
                            <div
                                onClick={() => decrement(product.id)}
                                className="p-1"
                            >
                                <HiMinusSm style={{ fontSize: '1rem' }} />
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className="flex flex-col flex-grow font-normal rtl:mr-1 lrt:ml-1"
                    style={{ fontSize: '15px' }}
                >
                    <p>{t.totalAmount}</p>
                    <ProductPrice
                        currency={product.price.currency}
                        price={parseFloat(product.price.value) * counter!}
                    />
                </div>
            </div>
        </div>
    )
}

export default CartItem
