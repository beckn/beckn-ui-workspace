const testIds = {
  // application wise base url
  url_base: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
  url_base_retail: process.env.CYPRESS_BASE_URL || 'http://localhost:3002',
  // general
  goBack: 'go-back',
  feedback: 'feedback-toast',
  loadingIndicator: 'loading-indicator',
  noDataAvailable: 'no-data-available',
  cartButton: 'cart-button',
  location: 'location',
  searchInput: 'search-input',
  searchButton: 'search-button',
  threeDots: 'three-dots',
  close: 'close',
  pageName: 'pageName',
  invoiceModal: 'invoiceModal',
  downloadInvoiceIcon: 'downloadInvoiceIcon',
  invoice: 'invoice',
  // items
  item_list: 'item-list',
  item_title: 'item-title',
  item_subTitle: 'item-sub-title',
  item_details: 'item-details',
  item_image: 'item-image',
  item_rating: 'item-rating',
  item_description: 'item-description',
  item_price: 'item-price',
  item_quantity: 'item-quantity',
  // payment
  payment_basePrice: 'base-price',
  payment_taxes: 'taxes',
  payment_totalPayment: 'totalPayment',

  // Deployed urls
  deployed_url_base: 'https://retail-dev.becknprotocol.io/',
  deployed_url_signup: 'https://retail-dev.becknprotocol.io/signUp',
  deployed_url_home: 'https://retail-dev.becknprotocol.io/',
  deployed_url_search: 'https://retail-dev.becknprotocol.io/search',

  // urls
  url_signup: '/signUp',
  url_home: '/',
  url_search: '/search',
  url_cart: '/cart',
  url_product: '/product',
  url_checkout: '/checkout',
  url_payment: '/paymentMode',
  url_orderDetails: '/orderDetails',
  url_orderConfirmation: '/orderConfirmation',
  url_updateShippingDetails: '/updateShippingDetails',
  url_invoice: '/invoiceDetails',
  url_orderHistory: '/orderHistory',
  url_feedback: '/feedback',
  // user credentials
  user_validEmail: 'ankit@gmail.com',
  user_validPassword: 'Enterthevoid@123',
  user_invalidPassword: 'Enterthevoid@1234',
  user_firstTimeLoginvalidEmail: 'aniket@gmail.com',
  user_firstTimeLoginvalidPassword: 'Aniket@123',
  user_firstTimeLoginvalidEmailOSC: 'aniket123@gmail.com',
  user_firstTimeLoginvalidPasswordOSC: 'Aniket@123',
  user_login: 'krushnaTest@test.com',
  user_password: 'Krushna@123',
  // auth page
  auth_inputEmail: 'input-email',
  auth_inputPassword: 'input-password',
  auth_loginButton: 'login-button',
  auth_registerButton: 'register-button',
  // home page
  homepage_appTitle: 'app-title',
  homepage_appSubtitle: 'app-subtitle',
  homepage_appDescription: 'app-description',
  homepage_appLogo: 'app-logo',
  homepage_footer: 'footer',
  // imported order
  homepage_importOrderContainer: 'imported-orders',
  homepage_viewDetailsButton: 'view-details-button',
  homepage_shoppingListItem: 'shopping-list-item',
  homepage_viewChatGPTList: 'view-chat-gpt-list',
  // search page
  searchpage_products: 'products',
  searchpage_filterContainer: 'filter-container',
  searchpage_filterButton: 'filter-button',
  searchpage_resetBtn: 'reset-button',
  searchpage_sortByPrice: 'sort-by-price',
  searchpage_filterByRating: 'filter-by-rating',
  searchpage_applyFilter: 'apply-filter',
  searchpage_cancelFilter: 'cancel-filter',
  // product page
  productpage_addTocartButton: 'add-to-cart-button',
  productpage_incrementCounter: 'increment-counter',
  productpage_counterValue: 'counter-value',
  productpage_decrementCounter: 'decrement-counter',
  // cart page
  cartpage_emptyImage: 'empty-card-image',
  cartpage_emptyheading: 'empty-card-heading',
  cartpage_emptySubHeading: 'empty-card-subheading',
  cartpage_emptyButton: 'empty-card-button',
  cartpage_productAddToCart: 'productAddtoCart',
  cartpage_itemImage: 'cart-card-image',
  cartpage_itemName: 'cart-item-name',
  cartpage_productPrice: 'product-price',
  cartpage_orderSummaryText: 'order-summary',
  cartpage_totalQuantityText: 'total-qunatity-text',
  cartpage_totalAmountText: 'total-amount-text',
  cartpage_cartOrderButton: 'cart-order-button',
  cartpage_decrementButton: 'decrement-button',
  cartpage_incrementButton: 'increment-button',
  cartpage_trashButton: 'trash-button',
  cartpage_input: 'cart-input',
  // checkout page
  checkoutpage_itemDetails: 'item-details',
  checkoutpage_form: 'form',
  checkoutpage_openForm: 'open-form',
  checkoutpage_name: 'name',
  checkoutpage_mobileNumber: 'mobileNumber',
  checkoutpage_email: 'email',
  checkoutpage_address: 'address',
  checkoutpage_pinCode: 'pinCode',
  checkoutpage_shippingDetails: 'shippingDetails',
  checkoutpage_billingDetails: 'billingDetails',
  checkoutpage_paymentDetails: 'paymentDetails',
  checkoutpage_checkbox: 'checkbox',
  checkoutpage_changeFormDetails: 'changeFormDetails',
  checkoutpage_basePrice: 'base-price',
  checkoutpage_taxes: 'taxes',
  checkoutpage_totalPayment: 'totalPayment',
  checkoutpage_proceedToCheckout: 'proceed-to-checkout',
  //payment page
  paymentpage_radioButton: 'radio-button',
  paymentpage_confirmButton: 'confirm-button',
  paymentpage_creditcardAndDebitCard: 'Credit & Debit Cards',
  paymentpage_addText: 'add',
  paymentpage_image: 'mode-of-payemnt-image',
  paymentpage_visa: 'visa',
  paymentpage_masterCard: 'masterCard',
  paymentpage_phonePay: 'phonePay',
  paymentpage_CashOnDelivery: 'CashOnDelivery',
  paymentpage_NetBanking: 'paymentpage-NetBanking',
  //orderConfirmation page
  confirmPageImage: 'confrimPage-image',
  orderConfirmation_successOrderMessage: 'suceess-OrderMessage',
  orderConfirmation_gratefulMessage: 'grateful-message',
  orderConfirmation_orderIdMessage: 'order-message',
  orderConfirmation_trackOrderMessage: 'track-order',
  orderConfirmation_viewOrderButton: 'viewOrderDetails-button',
  orderConfirmation_goBackToHome: 'goBackToHome-button',
  // profile page
  profile_saveandContinue: 'save-and-continue-button',
  profile_inputName: 'input-name',
  profile_inputMobileNumber: 'input-mobileNumber',
  profile_flatNumber: 'input-flatNumber',
  profile_street: 'input-street',
  profile_city: 'input-city',
  profile_zipCode: 'input-zipcode',
  profile_state: 'input-state',
  profile_country: 'input-country',
  profile_text_click: 'profile-text',
  profile_form: 'profile-form',
  // order details page
  orderDetailspage_orderOverview: 'orderOverview',
  orderDetailspage_progressSummary: 'progressSummary',
  orderDetailspage_shippingDetails: 'shippingDetails',
  orderDetailspage_billingDetails: 'billingDetails',
  orderDetailspage_paymentDetails: 'paymentDetails',
  orderDetailspage_productName: 'productName',
  orderDetailspage_productPlacedAt: 'productPlacedAt',
  orderDetailspage_orderId: 'orderId',
  orderDetailspage_orderStatus: 'status',
  orderDetailspage_orderStatusMap: 'statusMap',
  orderDetailspage_orderStateName: 'statusName',
  orderDetailspage_orderStateTime: 'statusTime',
  orderDetailspage_orderSummaryItemName: 'itemName',
  orderDetailspage_otherOptions: 'otherOptions',
  orderDetailspage_orderSummaryTotalItems: 'totalItems',
  orderDetailspage_viewMoreOrders: 'viewMoreOrders',
  orderDetailspage_menus: 'menus',
  orderDetailspage_cancelOrder: 'orderCancel',
  orderDetailspage_name: 'name',
  orderDetailspage_address: 'address',
  orderDetailspage_mobileNumber: 'mobileNumber',
  orderDetailspage_menuItem: 'menuItem',
  orderDetailspage_menuItemName: 'menuItemName',
  orderDetailspage_callServiceItem: 'callServiceItem',
  orderDetailspage_callServiceItemName: 'callServiceItemName',
  orderDetailspage_updateShippingDetails: 'updateShippingDetails',
  orderDetailspage_invoice_orderFullfilled: 'invoice_orderFullfilled',
  orderDetails_rateUs_mainContainer: 'feedbackPage-rateUs',
  order_feedback_container: 'order-feedback-container',
  //orderHistory page
  orderHistory_text_click: 'order-history-text',
  orderHistory_createdAt: 'order-History-createdAt',
  orderHistory_order_id: 'orderHistory-order-id',
  orderHistory_Price: 'orderHistory-Price',
  orderHistory_pendingIcon: 'orderHistory-pendingIcon',
  order_history_main_container: 'order-history-main-container',
  empty_order_image: 'empty-order-image',
  emptyOrderHistoryText: 'empty-OrderHistory-Text',
  noExistingWorkflowText: 'no-Existing-Work-flow-Text',
  emptyOrder_button: 'emptyOrder-button',
  //feedback page
  feedbackPage_orderDeliveredOnTime: 'feedbackPage-orderDelivered-OnTime',
  feedbackPage_pleaseShareYourFeedback: 'feedbackPage-pleaseShareYourFeedback',
  feedbackPage_addCommentsHere: 'feedbackPage-addCommentsHere',
  feedback_textarea: 'feedback-textarea',
  feedback_submitReview: 'feedback-submitReview',
  feedback_skip_forNow: 'feedback-skip-forNow',
  feedback_starRating: 'feedback-starRating',
  feedback_image: 'feedback-image',
  //logout
  Logout_text_click: 'Logout-text-click',

  //ODR App
  select_input: 'select-input',
  dropdown_item: 'dropdown-item',
  dropdown_item_list: 'dropdown-item-list',
  checkoutpage_respondent_Details: 'checkoutpage-respondent-Details',
  checkoutpage_complaints_Details: 'checkoutpage-complaints-Details',
  checkoutpage_dispute_Details: 'checkoutpage-dispute-Details',
  checkoutpage_consent_Details: 'checkoutpage-consent-Details',
  xinput_form_open: 'xinput_form_open',
  xinput_form: 'xinput-form',
  rateUsBox: 'rateUs-Box',

  //OSC
  url_search_StoreBy_Location: '/searchByLocation',
  search_By_Location_Text: 'search-By-Location-Text',
  map_search_input_container: 'map-search-input-container',
  map_search_input: 'map-search-input',
  locationList: 'location-List',
  location_List_item: 'location-List-item',
  map_container: 'map-container',
  option_card: 'option-card',
  store_Location_image: 'store-Location-image',
  searchBy_Location_shop_button: 'searchBy-Location-shop-button',

  // Industry4.0
  search_bar_main_container: 'search-bar-main-container',
  homepage_image: 'homepage-image',
  homepge_text: 'homepge-text',
  search_input: 'search-input',
  search_button: 'search-button',
  searchPage_container: 'searchPage-container',
  search_page_product_image: 'search-page-product-image',
  search_page_product_name: 'search-page-product-name',
  search_page_product_providerName: 'search-page-product-providerName',
  search_page_product_short_desc: 'search-page-product-short-desc',
  search_page_product_rating: 'search-page-product-rating',
  search_page_product_OnClick: 'search-page-product-OnClick',
  searchPage_input: 'searchPage_input',
  product_page_long_desc: 'product-page-long-desc',
  product_page_book_button: 'product-page-book-button',
  product_page_short_desc: 'product-page-short-desc',
  product_page_Image: 'product-page-Image',
  url_assembly: '/assemblyDetails',
  url_checkoutPage: '/checkoutPage',
  typeLabel: '#typeLabel',
  type: '#type',
  colorLabel: '#colorLabel',
  colour: '#colour',
  shapeLabel: '#shapeLabel',
  shape: '#shape',
  length: '#length',
  width: '#width',
  quantity: '#quantity',
  weight: '#weight',
  increaseQuantity: '#increaseQuantity',
  decreaseQuantity: '#decreaseQuantity',
  item_name: 'item-name',
  checkoutpage_cancelOrder_button: 'checkoutpage-cancelOrder-button',
  industry_payment_basePrice: 'Base Price',
  industry_payment_shippingCost: 'Shipping Cost',
  industry_payment_taxes: 'tax'
}

export { testIds }
