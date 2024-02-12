import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CartList from '../components/cart/CartList'
import OrderSummaryBox from '../components/cart/OrderSummaryBox'
import { useLanguage } from '../hooks/useLanguage'
import Loader from '../components/loader/Loader'
import useRequest from '../hooks/useRequest'
import {
    DataPerBpp,
    CartItemForRequest,
    ICartRootState,
    TransactionIdRootState,
    CartRetailItem,
} from '../lib/types/cart'
import { responseDataActions } from '../store/responseData-slice'
import {
    getCartItemsPerBpp,
    getItemsForCart,
    getPayloadForQuoteRequest,
} from '../utilities/cart-utils'
import EmptyCart from '../components/cart/EmptyCart'
import LoaderWithMessage from '../components/loader/LoaderWithMessage'

const Cart = () => {
    const [itemsForCart, setItemsForCart] = useState<CartRetailItem[]>([])
    const [isLoadingForCartCountChange, setIsLoadingForCartCountChange] =
        useState<boolean>(false)

    const quoteRequest = useRequest()
    const dispatch = useDispatch()
    const router = useRouter()
    const { t } = useLanguage()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

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

    useEffect(() => {
        if (localStorage && !localStorage.getItem('quoteResponse')) {
            quoteRequest.fetchData(
                `${apiUrl}/client/v2/get_quote`,
                'POST',
                payLoadForQuoteRequest
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (quoteRequest.data) {
            dispatch(responseDataActions.addQuoteResponse(quoteRequest.data))
            localStorage.setItem(
                'quoteResponse',
                JSON.stringify(quoteRequest.data)
            )

            const items = getItemsForCart(quoteRequest.data)
            setItemsForCart(items)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteRequest.data])

    useEffect(() => {
        if (localStorage) {
            const cachedQuoteResults = localStorage.getItem('quoteResponse')
            if (cachedQuoteResults) {
                const parsedCachedResults = JSON.parse(cachedQuoteResults)
                setItemsForCart(parsedCachedResults)
            }
        }
    }, [])

    const onOrderClick = () => {
        router.push('/checkoutPage')
    }

    // if (quoteRequest.loading || isLoadingForCartCountChange) {
    //     return <Loader loadingText={t.quoteRequestLoader} />
    // }

    if (quoteRequest.loading || isLoadingForCartCountChange) {
        return (
            <LoaderWithMessage
                loadingText={t.quoteRequestLoaderText}
                loadingSubText={t.quoteRequestLoaderSubText}
            />
        )
    }

    if (!itemsForCart.length) {
        return <EmptyCart />
    }

    return (
        <div>
            {/* <Breadcrumb /> */}
            <div className="flex justify-center flex-col md:flex-row items-start relative max-w-[2100px] mx-auto">
                <CartList
                    setIsLoadingForCartCountChange={
                        setIsLoadingForCartCountChange
                    }
                />
                <OrderSummaryBox onOrderClick={onOrderClick} />
            </div>
        </div>
    )
}

export default Cart
