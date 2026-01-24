export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  etaMinutes: number
  image: string
  location: string
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  price: number
  currency: string
  isVeg: boolean
  description: string
  image: string
}

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Spice Garden Bistro',
    cuisine: 'North Indian • Biryani',
    rating: 4.5,
    etaMinutes: 30,
    image: '/images/store-images/1.png',
    location: 'MG Road, Bengaluru'
  },
  {
    id: 'rest-2',
    name: 'Urban Pizza Co.',
    cuisine: 'Italian • Pizza • Fast Food',
    rating: 4.3,
    etaMinutes: 25,
    image: '/images/store-images/2.png',
    location: 'Koramangala, Bengaluru'
  },
  {
    id: 'rest-3',
    name: 'Green Bowl Salads',
    cuisine: 'Healthy • Salads',
    rating: 4.7,
    etaMinutes: 20,
    image: '/images/store-images/3.png',
    location: 'Indiranagar, Bengaluru'
  },
  {
    id: 'rest-4',
    name: 'Midnight Munchies Hub',
    cuisine: 'Snacks • Burgers • Beverages',
    rating: 4.2,
    etaMinutes: 35,
    image: '/images/store-images/4.png',
    location: 'HSR Layout, Bengaluru'
  }
]

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    restaurantId: 'rest-1',
    name: 'Hyderabadi Chicken Biryani',
    price: 260,
    currency: 'INR',
    isVeg: false,
    description: 'Long grain basmati rice cooked with aromatic spices and tender chicken.',
    image: '/images/category-img/NonVegBiryani.svg'
  },
  {
    id: 'item-2',
    restaurantId: 'rest-1',
    name: 'Paneer Butter Masala',
    price: 220,
    currency: 'INR',
    isVeg: true,
    description: 'Soft paneer cubes in rich, creamy tomato gravy.',
    image: '/images/category-img/VegCurry.svg'
  },
  {
    id: 'item-3',
    restaurantId: 'rest-2',
    name: 'Margherita Pizza',
    price: 299,
    currency: 'INR',
    isVeg: true,
    description: 'Classic cheese pizza with fresh basil and tomato sauce.',
    image: '/images/category-img/Pizza.svg'
  },
  {
    id: 'item-4',
    restaurantId: 'rest-2',
    name: 'Pepperoni Feast Pizza',
    price: 349,
    currency: 'INR',
    isVeg: false,
    description: 'Loaded with spicy pepperoni and extra cheese.',
    image: '/images/category-img/Pizza.svg'
  },
  {
    id: 'item-5',
    restaurantId: 'rest-3',
    name: 'Protein Power Bowl',
    price: 250,
    currency: 'INR',
    isVeg: true,
    description: 'Quinoa, grilled paneer, veggies, and a tangy dressing.',
    image: '/images/category-img/Salad.svg'
  },
  {
    id: 'item-6',
    restaurantId: 'rest-4',
    name: 'Classic Veg Burger',
    price: 180,
    currency: 'INR',
    isVeg: true,
    description: 'Crispy veg patty with fresh veggies and special sauce.',
    image: '/images/category-img/Burger.svg'
  }
]

export const searchRestaurants = (keyword: string): Restaurant[] => {
  const term = keyword.trim().toLowerCase()
  if (!term) return MOCK_RESTAURANTS

  return MOCK_RESTAURANTS.filter(restaurant => {
    const haystack = `${restaurant.name} ${restaurant.cuisine} ${restaurant.location}`.toLowerCase()
    return haystack.includes(term)
  })
}

export const getRestaurantMenu = (restaurantId: string): MenuItem[] => {
  return MOCK_MENU_ITEMS.filter(item => item.restaurantId === restaurantId)
}
