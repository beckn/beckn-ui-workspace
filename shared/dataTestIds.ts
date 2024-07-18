const Urls = {
  baseUrl: 'http://localhost:3002',
  signupPageUrl: 'http://localhost:3002/signUp',
  homePageUrl: 'http://localhost:3002/',
  searchPageUrl: 'http://localhost:3002/search',
  cartPageUrl: '/cart',
  productPageUrl: '/product'
}

const UserCredentials = {
  validEmail: 'ankit@gmail.com',
  validPassword: 'Enterthevoid@123',
  invalidPassword: 'Enterthevoid@1234'
}

const SearchInputTestIds = {
  searchInput: 'search-input',
  searchButton: 'search-button'
}

const ItemTestIds = {
  itemTitle: 'item-title',
  itemSubTitle: 'item-sub-title',
  itemDetails: 'item-details',
  itemImage: 'item-image',
  itemRating: 'item-rating',
  itemDescription: 'item-description',
  itemPrice: 'item-price'
}

const GeneralTestIds = {
  goBack: 'go-back',
  feedback: 'feedback-toast',
  loadingIndicator: 'loading-indicator',
  noDataAvailable: 'no-data-available',
  cartButton: 'cart-button',
  location: 'location'
}

const AuthPageTestIds = {
  inputEmail: 'input-email',
  inputPassword: 'input-password',
  loginButton: 'login-button',
  registerButton: 'register-button'
}

const HomePageTestIds = {
  ...SearchInputTestIds,
  ...ItemTestIds,
  appTitle: 'app-title',
  appSubtitle: 'app-subtitle',
  appDescription: 'app-description',
  appLogo: 'app-logo',
  footer: 'footer',
  // imported order
  container: 'imported-orders',
  viewDetailsButton: 'view-details-button',
  shoppingListItem: 'shopping-list-item',
  viewChatGPTList: 'view-chat-gpt-list'
}

const SearchPageTestIds = {
  ...SearchInputTestIds,
  ...ItemTestIds,
  products: 'products',
  // filter
  filterContainer: 'filter-container',
  filterButton: 'filter-button',
  resetBtn: 'reset-button',
  sortByPrice: 'sort-by-price',
  filterByRating: 'filter-by-rating',
  applyFilter: 'apply-filter',
  cancelFilter: 'cancel-filter'
}

const ProductPageTestIds = {
  ...ItemTestIds,
  addTocartButton: 'add-to-cart-button',
  incrementCounter: 'increment-counter',
  counterValue: 'counter-value',
  decrementCounter: 'decrement-counter'
}

export {
  Urls,
  UserCredentials,
  GeneralTestIds,
  AuthPageTestIds,
  HomePageTestIds,
  SearchPageTestIds,
  ProductPageTestIds
}
