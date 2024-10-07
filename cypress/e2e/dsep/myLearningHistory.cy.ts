import { formatTimestamp } from '../../../shared/utils/timestamp'
import { testIds } from '../../../shared/dataTestIds'

describe('MyLearning History Page Tests', () => {
  context('should Render Empty MyLearning Page when there is no Data in MyLearning Response', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_firstTimeLoginvalidEmail, testIds.user_firstTimeLoginvalidPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myLearning_text_click).click()
      cy.intercept('GET', '**/orders?filters[category]=1', {
        fixture: 'DSEP/myLearningHistory/emptyMyLearningResponse.json'
      }).as('getEmptyOrders')
    })
    it('Should render EmptyMyLearning page', () => {
      cy.url().should('include', '/myLearningOrderHistory')
      cy.getByData(testIds.empty_order_image).should('have.attr', 'src')
      cy.getByData(testIds.emptyOrderHistoryText).should('contain.text', 'No Courses found!')
      cy.getByData(testIds.noExistingWorkflowText).should(
        'contain.text',
        'Looks like you haven’t purchased any courses!'
      )
      cy.getByData(testIds.emptyOrder_button).click()
      cy.url().should('include', testIds.url_home)
    })
  })

  context('Should render MyLearning History Page if there is MyLearning response Data ', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)

      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myLearning_text_click).click()
      cy.intercept('GET', '**/orders?filters[category]=1', {
        fixture: 'DSEP/myLearningHistory/myLearningResponse.json'
      }).as('myLearningHistory')
    })

    it('Should render MyLearning History Page', () => {
      cy.fixture('DSEP/myLearningHistory/myLearningResponse.json').then(orderResponse => {
        const orderData = orderResponse.data[0].attributes
        const createdAt = formatTimestamp(orderData.createdAt)
        cy.getByData(testIds.myLearning_headingText).eq(1).should('contain.text', 'java springboot book')
        cy.getByData(testIds.myLearning_createdAt).eq(1).should('exist')
        cy.getByData(testIds.myLearning_order_id).eq(1).should('exist')
        cy.getByData(testIds.myLearning_order_id).eq(1).should('contain.text', `ID:`)
        cy.getByData('item-price').eq(1).should('contain.text', `₹1,000.00`)
      })
    })
    it('should navigate to perticular courses when click on view courses', () => {
      cy.getByData(testIds.view_course_btn).eq(0).click()
      cy.visit('https://www.edureka.co/spring-certification-course')
    })
  })
})
