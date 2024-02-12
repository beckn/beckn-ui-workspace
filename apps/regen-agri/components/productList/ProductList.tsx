import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { RetailItem } from '../../lib/types/products'
import Card from '../UI/card/Card'
import Sort from './Sort'
import { useDispatch, useSelector } from 'react-redux'
import { SortedProductsListActions } from '../../store/sortedProductList-slice'
import { IProductListRootState } from '../../lib/types/productList'

interface Props {
    productList: RetailItem[]
}
const ProductList: React.FC<Props> = ({ productList }) => {
    const { t } = useLanguage()

    const [selectedRadioBtn, setSelectedRadioBtn] = useState<string>('all')
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(
            SortedProductsListActions.sortProductsList({
                productsList: productList,
                sortBasedOn: selectedRadioBtn,
            })
        )
    }, [dispatch, productList, selectedRadioBtn])

    const sortedProductList = useSelector(
        (state: IProductListRootState) => state.sortedProductsList.productsList
    )

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedRadioBtn(e.currentTarget.id)
    }

    return (
        <div>
            {/* <Breadcrumb /> */}
            {/* <SubmenuCategory /> */}

            <div className="w-full xl:max-w-[2100px] mx-auto">
                {sortedProductList && sortedProductList.length ? (
                    <div>
                        <Sort
                            selectedBtn={selectedRadioBtn}
                            onChangeSelectedBtn={onChangeHandler}
                        />
                        <div
                            className="grid gap-4 md:gap-2 grid-cols-6 md:grid-cols-12"
                            style={{ marginTop: '140px' }}
                        >
                            {sortedProductList.map((product: RetailItem) => {
                                return (
                                    <Card
                                        key={product.id}
                                        product={product}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-palette-mute text-center mt-14">
                        {t.noProduct}
                    </p>
                )}
            </div>
        </div>
    )
}

export default ProductList
