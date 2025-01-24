import { testIds } from '../../../shared/dataTestIds'
import 'cypress-file-upload'

describe('My Credential Page ', () => {
  context('Consumer My Credential Page Flow', () => {
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
      cy.getByData('myCredintial').click()
    })

    context('Should render My Credential Page when no Response in Cred', () => {
      it('should display Empty Page  My Credential page with disabled buttons', () => {
        cy.visit(`${testIds.url_base}${'/myCredentials'}`)
        cy.intercept('GET', '/beckn-trade-bap/cred', {
          fixture: 'OpenSpark/myCred/credEmpty.json'
        }).as('emptyCred')
        cy.wait('@emptyCred')
        cy.getByData(testIds.upload_file).should('be.visible')
        cy.getByData(testIds.upload_file).should('contain.text', 'Upload a file')
        cy.getByData(testIds.drop_your_file_here).should('be.visible')
        cy.getByData(testIds.drop_your_file_here).should('contain.text', 'Drop your file here')
        cy.getByData(testIds.myCred_Cancel_button).should('be.disabled')
        cy.getByData(testIds.myCred_Upload_button).should('be.disabled')
      })
    })
    context('Should render My Credential Page when Response in Cred', () => {
      it('should display My Credential page', () => {
        cy.visit(`${testIds.url_base}${'/myCredentials'}`)
        const fileName = 'OpenSpark/myCred/aadhar_cred.json'
        cy.getByData('document-upload').attachFile(fileName)
        cy.wait(1000)
        cy.getByData(testIds.myCred_Upload_button).click()
        cy.intercept('POST', '/beckn-trade-bap/upload-cred', {
          fixture: 'OpenSpark/myCred/uplaodConsumer.json'
        }).as('uplaodConsumer.json')
        cy.intercept('GET', '/beckn-trade-bap/cred', {
          fixture: 'OpenSpark/myCred/uploadCredConsumer.json'
        }).as('uplaodCredConsumer')
        cy.getByData(testIds.Credentials_text).should('be.visible')
        cy.getByData(testIds.document_upload_icon).should('be.visible')
        cy.getByData(testIds.document_title).should('be.visible')
        cy.getByData(testIds.document_uplaod_date).should('be.visible')
        cy.getByData(testIds.delete_Icon).should('be.visible')
        cy.getByData(testIds.myCred_Upload_button).should('be.disabled')
      })
      it('should remove credential after click on delete button', () => {
        cy.getByData(testIds.delete_Icon).eq(0).click()
        cy.getByData('delete-modal-message').should('be.visible')
        cy.getByData('delete-modal-yes-button').should('be.visible')
        cy.getByData('delete-modal-cancel-button').should('be.visible')
        cy.getByData('delete-modal-yes-button').click()
        cy.intercept('DELETE', '/beckn-trade-bap/cred/221', {
          fixture: 'OpenSpark/myCred/deleteConsumerCred.json'
        }).as('deleteConsumerCred')
        cy.intercept('GET', '/beckn-trade-bap/cred', {
          fixture: 'OpenSpark/myCred/credEmpty.json'
        }).as('afterDeleteders.json')
      })
    })
  })
  context('Prosumer My Credential Page Flow', () => {
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
      cy.getByData('myCredintial').click()
    })

    context('Should render My Credential Page when no Response in Cred', () => {
      it('should display Empty Page  My Credential page with disabled buttons', () => {
        cy.visit(`${testIds.url_base}${'/myCredentials'}`)
        cy.intercept('GET', '/beckn-trade-bap/cred', {
          fixture: 'OpenSpark/myCred/credEmpty.json'
        }).as('emptyCred')
        cy.getByData(testIds.upload_file).should('be.visible')
        cy.getByData(testIds.upload_file).should('contain.text', 'Upload a file')
        cy.getByData(testIds.drop_your_file_here).should('be.visible')
        cy.getByData(testIds.drop_your_file_here).should('contain.text', 'Drop your file here')
        cy.getByData(testIds.myCred_Cancel_button).should('be.disabled')
        cy.getByData(testIds.myCred_Upload_button).should('be.disabled')
      })
    })
    context('Should render My Credential Page when Response in Cred', () => {
      it('should display My Credential page', () => {
        cy.visit(`${testIds.url_base}${'/myCredentials'}`)
        const fileName = 'OpenSpark/myCred/aadhar_cred.json'
        cy.getByData('document-upload').attachFile(fileName)
        cy.wait(1000)
        cy.getByData(testIds.myCred_Upload_button).click()
        cy.intercept('POST', '/beckn-trade-bpp/upload-cred', {
          fixture: 'OpenSpark/myCred/uloadProducer.json'
        }).as('uloadProducer.json')
        cy.intercept('GET', '/beckn-trade-bpp/cred', {
          fixture: 'OpenSpark/myCred/uploadCredProsumer.json'
        }).as('uploadCredProsumer')
        cy.getByData(testIds.Credentials_text).should('be.visible')
        cy.getByData(testIds.document_upload_icon).should('be.visible')
        cy.getByData(testIds.document_title).should('be.visible')
        cy.getByData(testIds.document_uplaod_date).should('be.visible')
        cy.getByData(testIds.delete_Icon).should('be.visible')
        cy.getByData(testIds.myCred_Upload_button).should('be.disabled')
      })
      it('should remove credential after click on delete button', () => {
        cy.getByData(testIds.delete_Icon).eq(0).click()
        cy.getByData('delete-modal-message').should('be.visible')
        cy.getByData('delete-modal-yes-button').should('be.visible')
        cy.getByData('delete-modal-cancel-button').should('be.visible')
        cy.getByData('delete-modal-yes-button').click()
        cy.intercept('DELETE', '/beckn-trade-bpp/cred/236', {
          fixture: 'OpenSpark/myCred/deleteProsumerCred.json'
        }).as('deleteProsumerCred')
        cy.intercept('GET', '/beckn-trade-bpp/cred', {
          fixture: 'OpenSpark/myCred/credEmpty.json'
        }).as('afterDeleteders.json')
      })
    })
  })
})
