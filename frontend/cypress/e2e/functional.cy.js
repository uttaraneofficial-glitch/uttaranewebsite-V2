describe('Functional Tests', () => {
    beforeEach(() => {
        // Set viewport to desktop to ensure sidebar is visible
        cy.viewport(1280, 720);
    });

    it('Admin Login -> Dashboard -> Logout Flow', () => {
        cy.visit('/admin/login');

        // Login
        cy.get('input[name="username"]').type('admin');
        cy.get('input[name="password"]').type('admin123');
        cy.get('button[type="submit"]').click();

        // Verify Dashboard
        cy.url().should('include', '/admin');
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Overview').should('be.visible');

        // Logout
        // Sidebar should be visible on desktop
        cy.contains('Sign Out').click();

        // Verify Redirect to Login
        cy.url().should('include', '/admin/login');
        cy.contains('Admin Login').should('be.visible');
    });

    it('Public Contact Form Submission', () => {
        cy.visit('/contact');

        // Fill Form
        cy.get('input[name="fullName"]').type('Cypress Test User');
        cy.get('input[name="email"]').type('cypress@example.com');
        cy.get('input[name="subject"]').type('Automated Test Subject');
        cy.get('textarea[name="message"]').type('This is an automated test message from Cypress.');

        // Submit
        cy.get('button[type="submit"]').click();

        // Verify Success Message
        cy.contains('Thank you for your message', { timeout: 10000 }).should('be.visible');
    });
});
