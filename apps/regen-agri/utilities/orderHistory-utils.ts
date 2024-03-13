import { ResponseModel } from '../lib/types/responseModel'

export const getTotalQuantityOfSingleOrder = (orderArray: any) => {
    let totalQuantity = 0
    orderArray.map((res: any) => {
        const itemsLength: number =
            res?.message?.responses?.[0]?.message?.order?.items?.length
        totalQuantity += itemsLength
    })
    return totalQuantity
}

export const getTotalPriceOfSingleOrder = (orderArray: any) => {
    let totalPrice = 0
    orderArray.map((res: any) => {
        const price: number = parseFloat(
            res?.message?.responses?.[0]?.message?.order?.payment?.params.amount
        )
        totalPrice += price
    })
    return totalPrice
}

export const getSubTotalAndDeliveryChargesForOrder = (
    confirmData: ResponseModel[] | null
) => {
    let subTotal = 0
    let totalDeliveryCharge = 0

    if (confirmData) {
        confirmData.forEach((data) => {
            const deliveryAmount = parseFloat(
                data.message.responses[0].message.order.quote.breakup[1].price
                    .listed_value
            )
            totalDeliveryCharge += parseFloat(deliveryAmount.toFixed(2))

            const subTotalAmount = parseFloat(
                data.message.responses[0].message.order.quote.breakup[0].price
                    .listed_value
            )

            subTotal += parseFloat(subTotalAmount.toFixed(2))
        })
    }

    return { subTotal, totalDeliveryCharge }
}

export const retrieveArrayById = (id: string, data: any) => {
    for (const item of data) {
        const itemId = Object.keys(item)[0]
        if (itemId === id.toString()) {
            return item[itemId]
        }
    }
    return []
}
