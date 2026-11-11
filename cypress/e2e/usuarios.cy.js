/// <reference types="cypress" />
let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    })
});

describe('GET - Teste de API - Gestão de Usuários', () => {
    it('Deve listar todos os usuários', () => {
        cy.api({
            method: 'GET',
            url: '/users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('users');
            expect(response.body.users).to.be.an('array');
        });
    });
    it('Deve validar propriedades de um usuário', () => {
        cy.api({
            method: 'GET',
            url: '/users/',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('users');
            expect(response.body.users).to.be.an('array');
            expect(response.body.users[0]).to.have.property('id');
            expect(response.body.users[0]).to.have.property('name');
            expect(response.body.users[0]).to.have.property('email');
        });

    });
    it('Deve listar um usuario com sucesso buscando por ID', () => {
        cy.api({
            method: 'GET',
            url: '/users/2',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('email');
        });
    });
    it('Deve listar Usuário com sucesso buscando pelo filtro - paramentro', () => {
        cy.api({
            method: 'GET',
            url: '/users',
            headers: { 'Authorization': token },
            qs: {
                Page: 1,
                Limit: 20,
                Search: 'Usuário'
            }
        }).should(response => {
            expect(response.status).to.equal(200);
        })
    });
});

describe('POST - Teste de API - Gestão de Usuários', () => {
    it('Deve cadastrar um usuario com sucesso', () => {
        let email = `usuario${Math.floor(Math.random() * 1000)}@email.com`;
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Maria Santos",
                "email": email,
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(201)
            //expect(response.status).to.equal(400)
            expect(response.body.message).to.equal("Usuário criado com sucesso.")
            //expect(response.body.message).to.equal("Formato de email inválido.")
        })
    });
});

describe('PUT - Teste de API - Gestão de Usuários', () => {
    it('Deve atualizar um usuário com sucesso', () => {
        cy.api({
            method: 'PUT',
            url: 'users/10',
            headers: { 'Authorization': token },
            body: {
                name: "Maria Silva atualizada",
                email: "mariasilva.novonovo@email.com",
                password: "senha1234"
            }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal("Usuário atualizado com sucesso.")
        })
    });
    it('Deve atualizar um usuário com sucesso - de forma dinamica', () => {
        let email = `usuario${Math.floor(Math.random() * 1000)}@email.com`;
        cy.cadastrarUsuario("Maria Silva", email, "senha123").then(userId => {
            cy.api({
                method: 'PUT',
                url: 'users/' + userId,
                headers: { 'Authorization': token },
                body: {
                    name: "Maria Silva atualizada",
                    email: email,
                    password: "senha1234"
                }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal("Usuário atualizado com sucesso.")
            })
        })
    });

});

describe('DELETE - Teste de API - Gestão de Usuários', () => {
    it.skip('Deve deletar um usuário com sucesso', () => {
        cy.api({
            method: 'DELETE',
            url: 'users/10',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal("Usuário removido com sucesso.")
        });
    });
    it('Deve deletar um usuário com sucesso - de forma dinamica', () => {
        let email = `usuario${Math.floor(Math.random() * 1000)}@email.com`;
        cy.cadastrarUsuario("Maria Silva", email, "senha123").then(userId => {
            cy.api({
                method: 'DELETE',
                url: 'users/' + userId,
                headers: { 'Authorization': token }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal("Usuário removido com sucesso.")
            })
        })
    });
});