describe('Smoke Test', () => {
    it('loads the homepage', () => {
        cy.visit('/', { timeout: 10000 });
        // Check for any text that should definitely be there
        cy.get('body').should('be.visible');
        // Wait for potential loading state
        cy.wait(1000);
        // Check for the CTA button which is static
        cy.contains('Explore Companies', { timeout: 10000 }).should('be.visible');
    });

    it('navigates to companies page', () => {
        cy.visit('/');
        cy.contains('Explore Companies').click();
        cy.url().should('include', '/company');
    });
});
