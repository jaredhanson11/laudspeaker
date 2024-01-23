/* eslint-disable jest/valid-expect */
import credentials from "../fixtures/credentials";
import createNewSegment from "./createNewSegment";
import setupDelayTrigger from "./setupDelayTrigger";
const { emailTemplate } = credentials.MessageHitUser;

export default (
  audience1Name = "23232323",
  audience2Name = "23212414151323",
  setupTemplate = (selector: string) => {
    cy.get("#email > .p-0 > .justify-between").drag(selector, { force: true });
    cy.get("#activeJourney").click();
    cy.contains(emailTemplate.name).click();
    cy.get("#exportSelectedTemplate").click();
  }
) => {
  cy.get('[data-disclosure-link="Journey Builder"]').click();
  cy.wait(100);
  cy.get(".mt-6 > .inline-flex").click();
  cy.get("#name").type("Delay test");
  cy.get("#createJourneySubmit").click();
  cy.wait(3000);
  cy.get("#audience > .p-0 > .justify-between").click();
  cy.get("#name").type(audience1Name);
  cy.contains("Finish later").click();
  cy.wait(1000);
  cy.get(".text-updater").move({ deltaX: 100, deltaY: 100, force: true });
  cy.wait(2000);
  cy.get("#audience > .p-0 > .justify-between").click();
  cy.get("#name").type(audience2Name);
  cy.contains("Finish later").click();
  cy.wait(1000);
  cy.get('[data-isprimary]:not([data-isprimary="true"])').move({
    deltaX: 100,
    deltaY: 300,
    force: true,
  });
  cy.wait(2000);
  setupTemplate('[data-isprimary]:not([data-isprimary="true"])');
  cy.wait(2000);
  setupDelayTrigger('[data-isprimary="true"]');
  cy.wait(2000);
  cy.get(
    '[style="display: flex; height: 22px; position: absolute; left: 0px; bottom: 0px; align-items: center; width: 100%; justify-content: space-around;"] > .react-flow__handle'
  ).drag('[data-isprimary]:not([data-isprimary="true"])', { force: true });
  cy.wait(2000);
  cy.get('[data-isprimary]:not([data-isprimary="true"])').click();

  createNewSegment();

  cy.contains("Save").click();
  cy.wait(1000);
  cy.contains("Start").click();
  cy.wait(3000);
  cy.request(`${Cypress.env("AxiosURL")}tests/test-customer-id`).then(
    ({ body: id }) => {
      cy.wait(30000);
      // no
      cy.request(
        `${Cypress.env("AxiosURL")}tests/audience-by-customer/${id}`
      ).then(({ body: { name } }) => {
        expect(name).to.equal(audience1Name);
      });
      cy.wait(20000);
      // no
      cy.request(
        `${Cypress.env("AxiosURL")}tests/audience-by-customer/${id}`
      ).then(({ body: { name } }) => {
        expect(name).to.equal(audience1Name);
      });
      cy.wait(20000);
      // yes
      cy.request(
        `${Cypress.env("AxiosURL")}tests/audience-by-customer/${id}`
      ).then(({ body: { name } }) => {
        expect(name).to.equal(audience2Name);
      });
    }
  );
};
