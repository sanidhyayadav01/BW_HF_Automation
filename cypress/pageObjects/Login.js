class LoginPage {
  Login(username, password) {

    cy.contains('Login').click();
    cy.get('[name="userName"]').type(username);
    cy.get('[name="password"]').type(password);
    cy.get(':nth-child(3) > .gap-2').click();
  }
}

export default LoginPage;
