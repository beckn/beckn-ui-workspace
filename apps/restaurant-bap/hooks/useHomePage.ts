import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { setSearchTerm, SearchTermModel } from '@beckn-ui/common/src/store/search-slice'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { feedbackActions } from '@beckn-ui/common/src/store/ui-feedback-slice'
import { MOCK_MENU_ITEMS } from '../constants/product'
import { MOCK_RESTAURANTS } from '../constants/restaurants'
import { convertToParsedItem } from '../constants/mockApi'
import type { MenuItem } from '../components/home/FoodItemCard'
import type { Restaurant } from '../components/home/RestaurantCard'

export const useHomePage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { searchTerm } = useSelector((state: RootState) => state.search)

  // State
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters] = useState<Record<string, string>>({})

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_MENU_ITEMS.map(item => item.category)))
    return cats.slice(0, 10)
  }, [])

  // Get unique restaurants from menu items
  const restaurants: Restaurant[] = useMemo(() => {
    const restaurantNames = Array.from(new Set(MOCK_MENU_ITEMS.map(item => item.restaurant)))
    return restaurantNames.map((name, idx) => {
      const restaurant = MOCK_RESTAURANTS.find(r => r.name.includes(name.split(' ')[0])) || MOCK_RESTAURANTS[0]
      const items = MOCK_MENU_ITEMS.filter(item => item.restaurant === name)
      const avgRating = items.reduce((sum, item) => sum + item.rating, 0) / items.length
      return {
        id: `rest-${idx}`,
        name,
        cuisine: items[0]?.category || 'Multi-cuisine',
        rating: avgRating,
        etaMinutes: restaurant.etaMinutes || 30,
        image: restaurant.image || '/images/store-images/1.png',
        location: restaurant.location || 'Nearby',
        itemCount: items.length
      }
    })
  }, [])

  // Apply filters and sorting
  const applyFilters = useCallback(
    (items: MenuItem[]) => {
      const filtered = [...items]

      if (filters.sortBy === 'LowtoHigh') {
        filtered.sort((a, b) => a.price - b.price)
      } else if (filters.sortBy === 'HightoLow') {
        filtered.sort((a, b) => b.price - a.price)
      } else if (filters.sortBy === 'RatingLowtoHigh') {
        filtered.sort((a, b) => a.rating - b.rating)
      } else if (filters.sortBy === 'RatingHightoLow') {
        filtered.sort((a, b) => b.rating - a.rating)
      }

      return filtered
    },
    [filters]
  )

  // Get popular items (top rated)
  const popularItems: MenuItem[] = useMemo(() => {
    const items = [...MOCK_MENU_ITEMS].sort((a, b) => b.rating - a.rating).slice(0, 8)
    return applyFilters(items)
  }, [applyFilters])

  // Get featured items (by price/rating mix)
  const featuredItems: MenuItem[] = useMemo(() => {
    const items = [...MOCK_MENU_ITEMS].sort((a, b) => b.rating * 100 + b.price - (a.rating * 100 + a.price)).slice(0, 6)
    return applyFilters(items)
  }, [applyFilters])

  // Get filtered items by category
  const categoryItems: MenuItem[] = useMemo(() => {
    if (!selectedCategory) return []
    const items = MOCK_MENU_ITEMS.filter(item => item.category === selectedCategory).slice(0, 8)
    return applyFilters(items)
  }, [selectedCategory, applyFilters])

  // Load search term from Redux
  useEffect(() => {
    if ((searchTerm as SearchTermModel)?.searchKeyword) {
      setSearchKeyword((searchTerm as SearchTermModel).searchKeyword)
    }
  }, [searchTerm])

  // Handlers
  const handleSearch = useCallback(() => {
    if (searchKeyword.trim()) {
      dispatch(setSearchTerm({ searchKeyword: searchKeyword.trim() }))
      router.push('/search')
    }
  }, [searchKeyword, dispatch, router])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch]
  )

  const handleCategoryClick = useCallback(
    (category: string) => {
      const isDeselecting = selectedCategory === category
      setSelectedCategory(prev => (category === prev ? null : category))

      // Update search keyword when category is clicked
      if (isDeselecting) {
        // If deselecting, clear the search keyword
        setSearchKeyword('')
        dispatch(setSearchTerm({ searchKeyword: '' }))
      } else {
        // If selecting, set the search keyword to the category name
        setSearchKeyword(category)
        dispatch(setSearchTerm({ searchKeyword: category }))
      }
    },
    [selectedCategory, dispatch]
  )

  const handleItemClick = useCallback(
    (itemId: number) => {
      router.push(`/product?itemId=${itemId}`)
    },
    [router]
  )

  const handleRestaurantClick = useCallback(
    (restaurantName: string) => {
      dispatch(setSearchTerm({ searchKeyword: restaurantName }))
      router.push('/search')
    },
    [dispatch, router]
  )

  const handleApplyFilter = useCallback((filterData: Record<string, string>) => {
    setFilters(filterData)
    setShowFilter(false)
  }, [])

  const handleResetFilter = useCallback(() => {
    setFilters({})
  }, [])

  const handleToggleFilter = useCallback(() => {
    setShowFilter(prev => !prev)
  }, [])

  const handleAddToCart = useCallback(
    (item: MenuItem, e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation()
      }
      const parsedItem = convertToParsedItem(item as any)
      dispatch(cartActions.addItemToCart({ product: parsedItem, quantity: 1 }))
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Success',
            display: true,
            type: 'success',
            description: `${item.name} added to cart`
          }
        })
      )
    },
    [dispatch]
  )

  return {
    // State
    searchKeyword,
    selectedCategory,
    viewMode,
    showFilter,

    // Data
    categories,
    restaurants,
    popularItems,
    featuredItems,
    categoryItems,

    // Setters
    setSearchKeyword,
    setViewMode,

    // Handlers
    handleSearch,
    handleKeyPress,
    handleCategoryClick,
    handleItemClick,
    handleRestaurantClick,
    handleApplyFilter,
    handleResetFilter,
    handleToggleFilter,
    handleAddToCart
  }
}
