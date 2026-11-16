/// <reference types="cypress" />

//const { useId } = require("react");

describe('Testes da Funcionalidade Catálogo de Livros-ADM', () => {
     let token
     beforeEach(() => {
          cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
               token = tkn
          });
     });
     // Objetivo: Verificar que a API retorna lista de livros com paginação e filtros funcionando - feito
     // Validar que filtros por categoria e autores funcionam corretamente - feito?
     it('GET - Deve listar livros com filtros e paginação', () => {
          cy.api({
               method: 'GET',
               url: '/books',
               headers: { 'Authorization': token },
               qs: {
                    Page: 1,
                    Limit: 10
               }
          }).then((response) => {
               expect(response.status).to.eq(200);
               expect(response.body.books).to.be.an('array');
          });
     });

     it('GET - Deve validar propriedades de livros', () => {
          cy.api({
               method: 'GET',
               url: '/books',
               headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200);
               expect(response.body).to.have.property('books');
               expect(response.body.books).to.be.an('array');
               expect(response.body.books[0]).to.have.property('id');
               expect(response.body.books[0]).to.have.property('title');
               expect(response.body.books[0]).to.have.property('author');
          });

     });

     // Objetivo: Validar que é possível obter detalhes de um livro específico pelo ID- feito
     // Verificar que todos os campos do livro são retornados corretamente- feito
     it('GET - Deve obter detalhes de um livro específico', () => {
          //TODO: 
          cy.api({
               method: 'GET',
               url: '/books/2',
               headers: { 'Authorization': token }
          }).should(response => {
               expect(response.status).to.equal(200);
               expect(response.body).to.have.property('book');
               expect(response.body.book).to.have.property('id');
               expect(response.body.book).to.have.property('title');
               expect(response.body.book).to.have.property('author');
               expect(response.body.book).to.have.property('category');
               expect(response.body.book).to.have.property('editor');
          });
     });
     // Objetivo: Garantir que dados inválidos são rejeitados ao adicionar um livro - feito
     // Validar mensagens de erro apropriadas para dados faltantes ou incorretos
     it('POST -  Deve rejeitar livro com dados inválidos', () => {
          cy.api({
               method: 'POST',
               url: '/books',
               headers: { 'Authorization': token },
               body: {
                    "title": "",
                    "author": "",
                    "description": "",
                    "category": "",
                    "isbn": "",
                    "editor": "",
                    "language": "",
                    "publication_year": "",
                    "pages": "",
                    "format": "",
                    "total_copies": "",
                    "available_copies": ""
               },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.eq(400);
               expect(response.body.message).to.equal("\"title\" is not allowed to be empty")
          });
     });
     // Objetivo: Validar que um novo livro é adicionado com sucesso ao catálogo - feito
     it('POST - Deve cadastrar um novo livro com sucesso', () => {
          cy.api({
               method: 'POST',
               url: '/books',
               headers: { 'Authorization': token },
               body: {
                    "title": `O Cortiço + ${Math.floor(Math.random() * 1000)}`,
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
          }).then((response) => {
               expect(response.status).to.eq(201);
               expect(response.body).to.have.property('book');
               expect(response.body.book).to.have.property('id');
               expect(response.body.book).to.have.property('title');
          });
     });
     // Objetivo: Validar que um livro pode ser removido do catálogo
     it('DELETE - Deve deletar um livro previamente cadastrado - de forma dinamica', () => {
          //TODO:
          cy.CadastrarLivros().then(Id => {
               cy.api({
                    method: 'DELETE',
                    url: '/books/' + Id,
                    headers: { 'Authorization': token }
               }).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.equal("Livro deletado com sucesso.")
               })
          })
     });
     // Objetivo: Validar que um livro pode ser atualizado com sucesso
     it('Deve Validar que um livro pode ser atualizado com sucesso - de forma dinamica', () => {
        cy.CadastrarLivros().then(Id => {
               cy.api({
                    method: 'PUT',
                    url: '/books/' + Id,
                    headers: { 'Authorization': token },
                body: {
                    "title": `Livro atualizado + ${Math.floor(Math.random() * 1000)}`,
                    "author": "Autor atualizado",
                    "description": "Descrição atualizda",
                    "category": "Literatura Brasileira",
                    "editor": "Editora Atualizada",
                }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal("Livro atualizado com sucesso.")
            })
        })
    });

});

describe('Testes da Funcionalidade do Catálogo de livros-User', () => {
     // Verificar que apenas admin pode adicionar novos livros (validação de permissão) - feito
     it('Deve tentar cadastrar um livro com um usuario não autorizado', () => {
          // Chama o comando customizado passando as credenciais
          cy.UserToken('usuario@teste.com', 'user123').then((token) => {
               // A partir daqui, a variável 'token' armazena o valor retornado
               cy.log('Token capturado com sucesso: ' + token);
               // Exemplo de uso do token capturado em uma requisição subsequente
               cy.api({
                    method: 'POST',
                    url: '/books',
                    failOnStatusCode: false, // Serve para validar o erro 403
                    headers: {
                         Authorization: `${token}`
                    },
                    body: {
                         "title": "Livro Exemplo",
                         "author": "Aluísio Azevedo",
                         "description": "Romance generico",
                         "category": "Literatura Brasileira",
                         "isbn": "999-00-999-0000-9",
                         "editor": "Editora Ática",
                         "language": "Português",
                         "publication_year": 1999,
                         "pages": 99,
                         "format": "Físico",
                         "total_copies": 9,
                         "available_copies": 9
                    }
               }).then((response) => {
                    // Valida o comportamento da requisição com o token obtido
                    expect(response.status).to.eq(403);
               });

          });
     });
     // Verificar que apenas admin pode deletar livros (validação de permissão)
     it('DELETE - Deve deletar um livro previamente cadastrado', () => {
          //TODO:
          cy.UserToken('usuario@teste.com', 'user123').then((token) => {
               cy.log('Token capturado com sucesso: ' + token);
               cy.api({
                    method: 'DELETE',
                    url: '/books/24',
                    failOnStatusCode: false, // Serve para validar o erro 403
                    headers: {
                         Authorization: `${token}`
                    }
               }).then((response) => {
                    expect(response.status).to.eq(403);
                    expect(response.body.message).to.equal("Acesso negado. Apenas administradores podem realizar esta ação.")
               });
          });
     // Verificar que apenas admin pode atualizar livros (validação de permissão)
     });
     it('PUT - Deve atualizar um livro previamente cadastrado', () => {
     //TODO: 
     });
});