import { testIds } from '../../../shared/dataTestIds'
import 'cypress-file-upload'

describe('My Ders Page ', () => {
  context('Consumer My Ders Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.intercept('GET', '/beckn-trade-bap/user-profile', {
        fixture: 'OpenSpark/profile/profile.json'
      }).as('profileCall')
      cy.getByData('myDers').click()
    })

    context('Should render Empty Ders Page when no Response in Ders', () => {
      it('should display Empty Page  My Ders page', () => {
        cy.visit(`${testIds.url_base}${'/myDers'}`)
        cy.intercept('GET', '/beckn-trade-bap/der', {
          fixture: 'OpenSpark/myDers/emptyMyDers.json'
        }).as('emptyMyDers')
        cy.wait('@emptyMyDers')
        cy.getByData('pair-device').should('be.visible')
        cy.getByData('pair-device').should('contain.text', 'Pair Device')
        cy.getByData('paired').should('be.visible')
        cy.getByData('add-devices-icon').should('be.visible')
      })
    })
    context('Should render My Ders Page when Response in Ders', () => {
      it('should display My Ders page', () => {
        cy.visit(`${testIds.url_base}${'/myDers'}`)
        cy.intercept('GET', '/beckn-trade-bap/der', {
          fixture: 'OpenSpark/myDers/myDers.json'
        }).as('myDers')
        cy.wait('@myDers')
        cy.getByData('device_name').should('be.visible')
        cy.getByData('remove-paired-device').should('be.visible')
      })
      it('should display paired devices', () => {
        cy.getByData('device_name').eq(0).should('contain.text', 'Storage battery2')
        cy.getByData('device_name').eq(1).should('contain.text', 'sd')
      })
      it('should Click on Plus icon  and Modal Should be Open', () => {
        cy.getByData('add-devices-icon').click()
        cy.getByData('add-new-ders-input').should('be.visible')
      })
      it('should fill and upload documents for new paired device', () => {
        cy.getByData('add-new-ders-input').clear().type('washing machine')
        const fileName = 'OpenSpark/myDers/sample_aadhar.pdf'
        cy.getByData('document-upload').attachFile(fileName)
        cy.getByData('add-new-ders').click()
        cy.getByData(testIds.loadingIndicator).should('be.visible')
        cy.intercept('GET', '/beckn-trade-bap/der', {
          fixture: 'OpenSpark/myDers/addNewDers.json'
        }).as('addNewDers')
        cy.wait(5000)
      })
      it('should display New paired devices', () => {
        cy.getByData('device_name').eq(2).should('contain.text', 'washing machine')
      })
      it('should remove paired device On clicking of remove button and open modal', () => {
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.visit(testIds.url_base)
        cy.getByData('consumer_button').click()
        cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
        cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
        cy.getByData(testIds.auth_loginButton).click()
        cy.url().should('include', testIds.url_home)
        cy.getByData(testIds.topSheet_profile_icon).click()
        cy.visit(`${testIds.url_base}${testIds.url_profile}`)
        cy.intercept('GET', '/beckn-trade-bap/user-profile', {
          fixture: 'OpenSpark/profile/profile.json'
        }).as('profileCall')
        cy.getByData('myDers').click()
        cy.getByData('remove-paired-device').eq(2).click()
        cy.getByData('delete-modal-message').should('be.visible')
        cy.getByData('delete-modal-yes-button').should('be.visible')
        cy.getByData('delete-modal-cancel-button').should('be.visible')
        cy.getByData('delete-modal-yes-button').click()
        cy.intercept('DELETE', '/beckn-trade-bap/der/30', {
          fixture: 'OpenSpark/myDers/deleteDers.json'
        }).as('deleteDers')
        cy.intercept('GET', '/beckn-trade-bap/der', {
          fixture: 'OpenSpark/myDers/afterDeleteders.json'
        }).as('afterDeleteders.json')
      })
      it('should not display remove paired devices', () => {
        cy.getByData('device_name').eq(1).should('be.visible')
      })
    })
  })
  context('Prosumer My Ders Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('producer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.intercept('GET', '/beckn-trade-bpp/user-profile', {
        fixture: 'OpenSpark/profile/producerProfile.json'
      }).as('producerProfile')
      cy.getByData('myDers').click()
    })

    context('Should render Empty Ders Page when no Response in Ders', () => {
      it('should display Empty Page  My Ders page', () => {
        cy.visit(`${testIds.url_base}${'/myDers'}`)
        cy.intercept('GET', '/beckn-trade-bpp/der', {
          fixture: 'OpenSpark/myDers/emptyMyDersProducer.json'
        }).as('emptyMyDersProducer')
        cy.wait('@emptyMyDersProducer')
        cy.getByData('pair-device').should('be.visible')
        cy.getByData('pair-device').should('contain.text', 'Pair Device')
        cy.getByData('paired').should('be.visible')
        cy.getByData('add-devices-icon').should('be.visible')
      })
    })
    context('Should render My Ders Page when Response in Ders', () => {
      it('should display My Ders page', () => {
        cy.visit(`${testIds.url_base}${'/myDers'}`)
        cy.intercept('GET', '/beckn-trade-bpp/der', {
          fixture: 'OpenSpark/myDers/myDersProducer.json'
        }).as('myDersProducer')
        cy.wait('@myDersProducer')
        cy.getByData('device_name').should('be.visible')
        cy.getByData('remove-paired-device').should('be.visible')
      })
      it('should display paired devices', () => {
        cy.getByData('device_name').eq(0).should('contain.text', 'Solar panel 1')
        cy.getByData('device_name').eq(1).should('contain.text', 'Solar panel 2')
      })
      it('should Click on Plus icon  and Modal Should be Open', () => {
        cy.getByData('add-devices-icon').click()
        cy.getByData('add-new-ders-input').should('be.visible')
      })
      it('should fill and upload documents for new paired device', () => {
        cy.getByData('add-new-ders-input').clear().type('Water Filter')
        const fileName = 'OpenSpark/myDers/sample_aadhar.pdf'
        cy.getByData('document-upload').attachFile(fileName)
        cy.getByData('add-new-ders').click()
        cy.getByData(testIds.loadingIndicator).should('be.visible')
        cy.intercept('GET', '/beckn-trade-bpp/der', {
          fixture: 'OpenSpark/myDers/addNewDersProducer.json'
        }).as('addNewDersProducer')
        cy.wait(5000)
      })
      it('should display New paired devices', () => {
        cy.getByData('device_name').eq(2).should('contain.text', 'Water Filter')
      })
      it('should remove paired device On clicking of remove button and open modal', () => {
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.visit(testIds.url_base)
        cy.getByData('producer_button').click()
        cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
        cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
        cy.getByData(testIds.auth_loginButton).click()
        cy.url().should('include', testIds.url_home)
        cy.getByData(testIds.topSheet_profile_icon).click()
        cy.visit(`${testIds.url_base}${testIds.url_profile}`)
        cy.intercept('GET', '/beckn-trade-bpp/user-profile', {
          fixture: 'OpenSpark/profile/producerProfile.json'
        }).as('producerProfile')
        cy.getByData('myDers').click()
        cy.getByData('remove-paired-device').eq(2).click()
        cy.getByData('delete-modal-message').should('be.visible')
        cy.getByData('delete-modal-yes-button').should('be.visible')
        cy.getByData('delete-modal-cancel-button').should('be.visible')
        cy.getByData('delete-modal-yes-button').click()
        cy.intercept('DELETE', '/beckn-trade-bpp/der/50', {
          fixture: 'OpenSpark/myDers/deleteProducerDers.json'
        }).as('deleteProducerDers')
        cy.intercept('GET', '/beckn-trade-bpp/der', {
          fixture: 'OpenSpark/myDers/afterDeleteProducerDers.json'
        }).as('afterDeleteProducerDers.json')
      })
      it('should not display remove paired devices', () => {
        cy.getByData('device_name').eq(1).should('be.visible')
      })
    })
  })
})
