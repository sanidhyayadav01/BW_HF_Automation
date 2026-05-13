// class SignUpPage {

//   FillForm(password) {

//     const randomId = Math.floor(
//       100000 + Math.random() * 900000
//     );

//     const username = `test${randomId}`;
//     const email = `${username}@gmail.com`;

//     cy.writeFile('cypress/fixtures/runtimeUser.json', {
//       username,
//       password
//     });

//     cy.wrap(username).as("generatedUsername");

//     cy.get(".text-primary-foreground")
//       .click();

//     cy.get('[name="userName"]')
//       .type(username);

//     cy.get('.duration-200 > [name="email"]')
//       .type(email);

//     cy.get('[name="password"]')
//       .type(password);

//     cy.get(".style_btnAll_login__us0__")
//       .click();

//     cy.log(`Created User: ${username}`);
//   }
// }

// export default SignUpPage;