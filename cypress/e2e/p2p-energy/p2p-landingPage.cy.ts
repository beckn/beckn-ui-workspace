import { testIds } from '../../../shared/dataTestIds'

describe('Check landing Page for p2p energy', () => {
  context('landing page flow', () => {
    beforeEach(() => {
      cy.visit(testIds.url_base)
    })
    it('should display Landing Page details for p2p energy', () => {
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
    })
    it('should display Footer details for p2p energy', () => {
      cy.getByData(testIds.footer_prefix_text).should('exist').and('be.visible')
      cy.getByData(testIds.footer_image).should('exist').and('be.visible')
      cy.getByData(testIds.footer_postfix_text).should('exist').and('be.visible')
      cy.getByData(testIds.footer_bottomfix_text).should('exist').and('be.visible')
    })
    it('should Talk to Lisa Card clickable', () => {
      cy.getByData(testIds.clickable_card_lisa).click()
    })
    it('should Talk to Open Spark clickable', () => {
      cy.getByData(testIds.clickable_card_open_spark).click()
    })
  })
})
