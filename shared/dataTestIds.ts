const testIds = {
  // application wise base url
  url_base: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
  url_base_retail: process.env.CYPRESS_BASE_URL || 'http://localhost:3002',
  url_base_tourism: process.env.CYPRESS_BASE_URL || 'http://localhost:3001',

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
  home_icon: 'home-icon',
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
  user_firstTimeLoginvalidEmail: 'pallavi@gmail.com',
  user_firstTimeLoginvalidPassword: 'Pallavi@123',
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
  cartSubTotal_Text: 'cartSub-Total-Text',
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
  item_provider: 'item-provider',
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
  industry_payment_taxes: 'tax',
  orderDetails_progress_summary: 'orderDetails-progress-summary',
  orderDetails_assembly_text: 'orderDetails-assembly-text',
  orderDetailspage_rtlAssembly_line: 'orderDetailspage-rtlAssembly-line',
  invoiceDetaislPage_orderOverview: 'invoiceDetaislPage-orderOverview',
  invoiceDetaislPage_assembly_text: 'invoiceDetaislPage-assembly-text',
  invoiceDetaislPage_price: 'invoiceDetaislPage-price',

  // Tourism
  searchInput_container: 'searchInput-container',
  homepage_searchInput: 'homepage-searchInput',
  homepage_search_button: 'homepage-search-button',
  loaction_list: 'loaction-list',
  location_list_item: 'location-list-item',
  orderDetailspage_order_fulfilled: 'orderDetailspage-order-fulfilled',
  orderDetails_tourism_QR_external_link: 'orderDetails-tourism-QR-external-link',
  orderDetails_tourism_QR_procedd_button: 'orderDetails-tourism-QR-procedd-button',
  orderDetails_QR_accordian: 'orderDetails-QR-accordian',

  // DSEP
  dsep_payment_basePrice: 'Course Fee',
  dsep_course_discount: 'Course Discount',
  dsep_payment_totalPayment: 'totalPayment',
  myScholarship_button: 'myScholarship-button',
  orderConfirmation_myLearning: 'orderConfirmation-myLearning',
  job_main_container: 'job-main-container',
  job_main_container_text: 'job-main-container-text',
  job_main_container_job_change_text: 'job-main-container-job-change-text',
  job_main_container_job_search_link: 'job-main-container-job-search-link',
  orderDetailspage_orderSummary: 'orderDetailspage-orderSummary',
  orderDetails_bookenIn_text: 'orderDetails-bookenIn-text',
  orderDetails_timestamp: 'orderDetails-timestamp',
  orderDetails_ordersFulfilled_text: 'orderDetails-ordersFulfilled-text',
  orderDetails_ordersFulfilled_length: 'orderDetails-ordersFulfilled-length',
  orderDetailspage_orderId_container: 'orderDetailspage-orderId-container',
  orderDetailspage_paymentDetails_container: 'orderDetailspage-paymentDetails-container',
  accordion_click: 'accordion-click',
  edit_button_Text: 'edit-button-Text',
  myLearning_text_click: 'myLearning-text-click',
  myLearning_createdAt: 'myLearning-createdAt',
  myLearning_headingText: 'myLearning-headingText',
  myLearning_order_id: 'myLearning-order-id',
  view_course_btn: 'view-course-btn',
  job_detail_link: 'job-detail-link',
  job_name: 'job-name-text',
  job_providerName: 'job-provider-name-text',
  job_cityName: 'job-city-name-',
  jobBy_providername: 'job-by-provider-name',
  job_details_name: 'job-details-name',
  job_details_provider_name: 'job-details-provider-name',
  job_details_description: 'job-details-description',
  job_details_apply: 'job-details-apply',
  scholarshipCardHeading: 'scholarshipCardHeading',
  scholarshipCardID: 'scholarshipCardID',
  scholarshipCardTime: 'scholarshipCardTime',
  scholarshipCardButton: 'scholarshipCardButton',
  myScholarship_text: 'myScholarship-text',
  search_card_link: 'search-card-link',
  search_card_Name: 'search-card-Name',
  search_Card_long_desc: 'search-Card-long-desc',
  search_card_providerName: 'search-card-providerName',
  scholarship_details_item_name: 'scholarship-details-item-name',
  scholarship_details_provider_name: 'scholarship-details-provider-name',
  scholarship_details_long_desc: 'scholarship-details-long-desc',
  scholarship_details_Button: 'scholarship-details-Button',
  jobSubmitted_viewNewJob: 'job-submitted-view-new-job',
  jobSubmitted_viewToHomePage: 'job-submitted-view-to-home-page',

  // mobility-bap
  mobility_map_container: 'map-container',
  mobility_map: 'map',
  mobility_info_content_container: 'info-content-container',
  mobility_pickup_dropoff: 'pickup-dropoff',
  mobility_alert_modal: 'alert-modal',
  mobility_pickup_label: 'pickup-label',
  mobility_dropoff_label: 'dropoff-label',
  mobility_pickup_address: 'pickup-address',
  mobility_dropoff_address: 'dropoff-address',
  mobility_on_focus_pickup: 'on-focus-pickup',
  mobility_on_focus_dropoff: 'on-focus-dropoff',
  mobility_search_btn: 'search-btn',
  mobility_cancel_search: 'cancel-search'
}

export { testIds }
