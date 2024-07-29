describe('OrderHistory Component', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_STRAPI_URL')}/orders?filters[category]=6`, req => {
      req.reply(res => {
        res.send({ data: [], error: null })
      })
    }).as('fetchOrders')
    cy.visit('/orderHistory')
  })

  it('Displays loader while fetching orders', () => {
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_STRAPI_URL')}/orders?filters[category]=6`, {
      delay: 1000,
      body: { data: [] }
    }).as('delayedFetchOrders')
    cy.visit('/orderHistory')
    cy.get('[data-testid="loader"]').should('be.visible')
    cy.wait('@delayedFetchOrders')
  })

  it('Displays error message if there is an error fetching orders', () => {
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_STRAPI_URL')}/orders?filters[category]=6`, {
      statusCode: 500,
      body: { error: { message: 'Something went wrong' } }
    }).as('fetchOrdersError')
    cy.visit('/orderHistory')
    cy.wait('@fetchOrdersError')
    cy.get('[data-testid="error-message"]').should('contain.text', 'Something went wrong')
  })

  it('Displays empty order component when there are no orders', () => {
    cy.wait('@fetchOrders')
    cy.get('[data-testid="empty-order"]').should('be.visible')
  })

  it('Displays order history list when there are orders', () => {
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_STRAPI_URL')}/orders?filters[category]=6`, {
      statusCode: 200,
      body: {
        data: [
          {
            attributes: {
              bpp_id: 'test-bpp-id',
              bpp_uri: 'test-bpp-uri',
              order_id: 'test-order-id',
              createdAt: '2023-07-29T00:00:00Z',
              quote: { price: { currency: 'USD', value: '100' } },
              delivery_status: 'In Review'
            }
          }
        ]
      }
    }).as('fetchOrdersWithData')
    cy.visit('/orderHistory')
    cy.wait('@fetchOrdersWithData')
    cy.get('[data-testid="order-history-item"]').should('have.length', 1)
    cy.get('[data-testid="order-id"]').should('contain.text', 'Order ID: test-order-id')
    cy.get('[data-testid="order-price"]').should('contain.text', 'USD 100')
    cy.get('[data-testid="order-status"]').should('contain.text', 'Pending')
  })

  it('Navigates to order details page on clicking an order', () => {
    cy.intercept('GET', `${Cypress.env('NEXT_PUBLIC_STRAPI_URL')}/orders?filters[category]=6`, {
      statusCode: 200,
      body: {
        data: [
          {
            attributes: {
              bpp_id: 'test-bpp-id',
              bpp_uri: 'test-bpp-uri',
              order_id: 'test-order-id',
              createdAt: '2023-07-29T00:00:00Z',
              quote: { price: { currency: 'USD', value: '100' } },
              delivery_status: 'In Review'
            }
          }
        ]
      }
    }).as('fetchOrdersWithData')
    cy.visit('/orderHistory')
    cy.wait('@fetchOrdersWithData')
    cy.get('[data-testid="order-history-item"]').first().click()
    cy.url().should('include', '/orderDetails')
  })
})
