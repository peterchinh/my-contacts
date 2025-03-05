// Feature: GET contacts from the API
// 	Scenario: Successfully retrieve list of contacts
// 	Given I run the backend
//  When I make a GET request to “/contacts”
// 	Then the response code should be 200
// 	And the response body should be a list of contacts


// Feature: User Login
// 	Scenario: Successfully login
// 	Given I have valid login credentials
//  When I send a POST to “/users/login” with my credentials
// 	Then the response code should be 200
// 	And I should receive an access and refresh token

const BACKEND_URL = "http://localhost:8000";

describe("User Login", () => {
    context("Successfully login", () => {
        it("GIVEN I have valid login credentials", () => { });
        
        it("When I send a POST to /users/login with my credentials", () => {
            cy.request({
                method: 'POST',
                url: `${BACKEND_URL}/users/login`,
                body: {
                    email: "cypresstesting@aaaa.com",
                    password: "Cypress123!"
                },
            }).then((response) => {
                
                assert.equal(response.status, 200, "Then the response code should be 200");
                assert.isDefined(response.body.accessToken, "And I received an access token");
                cy.getCookie("refreshToken").should("exist");
            });
        });
    });
});



describe("GET contacts from the API", () => {
    context("Successfully retrieve list of contacts", () => {
        it("GIVEN I run the backend", () => { });

        it("When I make a GET request to /contacts", () => {
            cy.request(`${BACKEND_URL}/contact`).then((response) => {
                assert.equal(response.status, 200, "Then the response code should be 200");
                assert.isArray(response.body, "And the response body should be a list of contacts")
            });
        });
    });
});
