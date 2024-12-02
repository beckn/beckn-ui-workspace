import { testIds } from '../../../shared/dataTestIds'

describe('Check landing Page for p2p Energy Open Spark landing page', () => {
  context('landing page flow', () => {
    beforeEach(() => {
      cy.visit(testIds.url_base)
      cy.getByData(testIds.p2p_energy_heading_text).should('exist').and('be.visible')
      cy.getByData(testIds.p2p_energy_heading_text_1).should('exist').and('be.visible')
      cy.getByData(testIds.p2p_energy_heading_text_2).should('exist').and('be.visible')
      cy.getByData(testIds.p2p_energy_landing_page_logo).should('exist').and('be.visible')
      cy.getByData(testIds.p2p_modal_text).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_img).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_title).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_badge).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_description).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_powered_by).should('exist').and('be.visible')
      cy.getByData(testIds.clickable_card_image).should('exist').and('be.visible')
      cy.getByData(testIds.footer_prefix_text).should('exist').and('be.visible')
      cy.getByData(testIds.footer_image).should('exist').and('be.visible')
      cy.getByData(testIds.footer_postfix_text).should('exist').and('be.visible')
      cy.getByData(testIds.footer_bottomfix_text).should('exist').and('be.visible')

      cy.getByData(testIds.clickable_card_open_spark).click()
    })

    it('should handle address conversion based on coordinates', () => {
      cy.getByData(testIds.locationIcon).should('be.visible')
      cy.getByData(testIds.yourLocation).should('be.visible')
      cy.getByData(testIds.skeleton).should('be.visible')
    })
    it('should display Landing Page details for Open Spark', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible')
      cy.getByData(testIds.homepage_appDescription).should('be.visible')
      cy.getByData(testIds.P2P_hompage_button).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
    })
    it('should Home Page Button clickable', () => {
      cy.getByData(testIds.P2P_hompage_button).click()
      cy.url().should('include', `${testIds.url_search}?searchTerm`)
    })
  })
})
