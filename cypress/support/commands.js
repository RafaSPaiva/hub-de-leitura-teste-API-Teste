// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('geraToken', (email, password) => {
    cy.request({
        method: 'POST',
        url: '/login',
        body: {
            email: email,
            password: password
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.token
    })
});
Cypress.Commands.add('cadastrarUsuario', (name, email, password) => {
    cy.api({
        method: 'POST',
        url: 'users',
        body: {
            "name": name,
            "email": email,
            "password": password
        }
    }).then((response) => {
        expect(response.status).to.equal(201)
        return response.body.user.id
    })
});
Cypress.Commands.add('UserToken', (email, password) => {
    cy.api({
        method: 'POST',
        url: '/login',
        body: {
            email: email,
            password: password
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body.token;
    });
});
Cypress.Commands.add('CadastrarLivros', () => {
    return cy.geraToken('admin@biblioteca.com', 'admin123').then((tkn) => {
        return cy.api({
            method: 'POST',
            url: '/books',
            headers: { Authorization: `${tkn}` },
            body: {
                "title": `Livro para validação + ${Math.floor(Math.random() * 1000)}`,
                "author": "Aluísio Azevedo",
                "description": "Romance naturalista que retrata a vida em um cortiço",
                "category": "Literatura Brasileira",
                "isbn": "978-85-260-1320-6",
                "editor": "Editora Ática",
                "language": "Português",
                "publication_year": 1890,
                "pages": 312,
                "format": "Físico",
                "total_copies": 4,
                "available_copies": 4
            }
        }).then(response => {
            expect(response.status).to.eq(201); // Geralmente cadastro retorna 201, ajuste para 200 se a sua API usar 200
            return response.body.id || response.body.book.id; // Retorna o ID do livro cadastrado (ajuste o caminho dependendo de como sua API retorna, ex: response.body.id ou response.body.book.id)
        });
    });
});