// Feature: Add a contact
// 	Scenario: First Name and Phone number required
// 		Given I have clicked Add Contact
// 		When I do not enter a First name and a phone number
// 		Then I should be told that I need to enter a first name and phone number
// 	Scenario: Successful Contact Add
// 		Given I have clicked Add Contact
// 		When I enter at least a phone number and first name (everything else optional)
// 		Then I should be able to see the contact in a card on the main page



describe('Add a contact', () => {
  context("First name and Phone Number Required", () => {
    beforeEach(() => {
      cy.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('Request failed with status code 403')) {
          return false;
        }
        return true;
      });
    });
    
    it("Login", () => {
      cy.visit('https://blue-sand-05b2e891e.4.azurestaticapps.net');
      cy.get('.login').within(() => {
        cy.get('input[type="email"]').type('cypresstesting@aaaa.com');
        cy.get('input[type="password"]').type('Cypress123!');
        cy.get('button[type="submit"]').click();
      });
    });

    it("GIVEN I have clicked Add contact", () => {
      cy.get('.addcontact').click();
    });

    it("When I do not enter a first name and a phone number", () => {
      cy.get('input[name="firstName"]').clear();
      cy.get('input[name="phone"]').clear();
    });

    it('Then I should be told that I need to enter a first name and phone number', () => {
      cy.contains('p', 'First Name & Full Phone Number Required')
        .should('be.visible');
    });
  });

  context("Successful Contact Add", () => {
    beforeEach(() => {
      cy.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('Request failed with status code 403')) {
          return false;
        }
        return true;
      });
    });

    it("GIVEN I have clicked Add contact", () => {
      cy.visit('https://blue-sand-05b2e891e.4.azurestaticapps.net')
      cy.get('.addcontact').click();
    });

    it("When I enter at least a phone number and first name (everything else optional)", () => {
      cy.get('input[name="firstName"]').type("myfirstname");
      cy.get('input[name="phone"]').type("7542927391");
      cy.get('input[type="submit"]').click();
    });

    it('Then I should be able to see the contact in a card on the main page', () => {
      cy.contains('.contactCard', 'myfirstname')
        .should('be.visible');
    });
  });

});

