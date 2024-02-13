import {
    CartItemForRequest,
    CartRetailItem,
    DataPerBpp,
} from '../lib/types/cart'
import { ResponseModel } from '../lib/types/responseModel'

export const getCartItemsPerBpp = (cart: CartItemForRequest[]) => {
    const itemsPerBpp = {}

    cart.map((item: CartItemForRequest) => {
        const bppId = item.bpp_id

        if (itemsPerBpp[bppId]) {
            itemsPerBpp[bppId].push(item)
        } else {
            itemsPerBpp[bppId] = [item]
        }
    })

    return itemsPerBpp
}

export const getPayloadForQuoteRequest = (
    cartItemsPerBppPerProvider: DataPerBpp,
    transactionId: { transactionId: string }
) => {
    const payload: any = {
        selectRequestDto: [],
    }

    Object.keys(cartItemsPerBppPerProvider).forEach((bppId) => {
        const cartItem: any = {
            context: {
                transaction_id: transactionId.transactionId,
                bpp_id: bppId,
                bpp_uri: cartItemsPerBppPerProvider[bppId][0].bpp_uri,
                domain: 'retail',
            },
            message: {
                order: {
                    items: [],
                    provider: {
                        id: cartItemsPerBppPerProvider[bppId][0].providerId,
                    },
                    locations: [
                        cartItemsPerBppPerProvider[bppId][0].locations[0],
                    ],
                },
            },
        }
        cartItemsPerBppPerProvider[bppId].forEach((item: any) => {
            if (item.bpp_id === bppId) {
                const itemObject = {
                    quantity: {
                        count: item.quantity,
                    },
                    id: item.id,
                }
                cartItem.message.order.items.push(itemObject)
            }
        })

        payload.selectRequestDto.push(cartItem)
    })
    return payload
}

export const getItemsForCart = (quoteData: ResponseModel[]) => {
    const items: CartRetailItem[] = []

    quoteData.forEach((data) => {
        const orderItems = data?.message?.catalogs?.order?.items ?? []
        items.push(...orderItems)
    })

    return items
}
