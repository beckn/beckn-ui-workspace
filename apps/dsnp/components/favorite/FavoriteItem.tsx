import React from 'react'
// import Image from 'next/image'
import { Image } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { favoriteActions } from '../../store/favorite-slice'
import { cartActions } from '../../store/cart-slice'
import { useLanguage } from '../../hooks/useLanguage'
import ProductPrice from '../UI/ProductPrice'
import { BsCartPlus } from 'react-icons/bs'
import { HiOutlineTrash } from 'react-icons/hi'
import { RetailItem } from '../../lib/types/products'
import { useTheme } from 'next-themes'

interface Props {
  product: RetailItem
}
const FavoriteItem: React.FC<Props> = ({ product }) => {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const dispatch = useDispatch()

  function onRemoveFavoriteItem(productSlug: string) {
    dispatch(favoriteActions.removeFromFavorite(productSlug))
  }

  function onAddToCart(product: RetailItem) {
    dispatch(cartActions.addItemToCart({ product: product, quantity: 1 }))
    toast.success(t('productAddedToCartMsg'), {
      theme: theme === 'dark' ? 'dark' : 'light'
    })
  }
  return (
    <div className="relative flex flex-col w-full h-full col-span-6 px-2 my-2 rounded-md shadow-lg sm:col-span-3 lg:col-span-4 xl:col-span-3 bg-palette-card">
      {/* <Link legacyBehavior
        href={`/${product.category[0]}/${product.category[1]}/${product.category[2]}/${product.slug.current}`}
      > */}
      <a className="flex flex-col flex-grow w-full p-3">
        <div className="text-center">
          {product.descriptor.images[0] && (
            <Image
              src={product.descriptor.images[0]}
              alt="laptop image"
              width={200}
              height={185}
              className="object-contain hover:scale-105 transition-transform !p-2"
            />
          )}
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <p>{product.descriptor.name}</p>
          <ProductPrice price={parseFloat(product.price.value)} />
        </div>
      </a>
      {/* </Link> */}
      <div className="flex flex-wrap items-center mx-4 mb-3">
        <button
          className="flex items-center justify-center flex-grow py-1 my-2 text-sm border-2 rounded-md shadow-md border-palette-primary text-palette-primary rtl:ml-2 ltr:mr-2 sm:my-0 sm:text-base"
          onClick={() => onAddToCart(product)}
        >
          <span className="ltr:mr-1 rtl:ml-1">
            <BsCartPlus />
          </span>
          {t('addToCart')}
        </button>
        <button
          className="flex items-center px-3 py-1 text-sm border-2 rounded-md shadow-md border-gray-600/40 dark:border-gray-200/60 text-palette-base/60 sm:text-base"
          onClick={() => onRemoveFavoriteItem(product.id)}
        >
          <span className="ltr:mr-1 rtl:ml-1">
            <HiOutlineTrash />
          </span>
          {t('delete')}
        </button>
      </div>
    </div>
  )
}

export default FavoriteItem
