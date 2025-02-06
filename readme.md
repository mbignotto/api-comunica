# API Comunica

Este é um projeto Node.js utilizando TypeScript, Sequelize e PostgreSQL. A API foi desenvolvida para ser executada em contêineres Docker e está configurada para rodar localmente ou em ambientes de contêineres. Este README fornece um guia passo a passo para rodar, testar e desenvolver o projeto.

## Tutorial Rápido

Siga os passos abaixo para configurar, rodar e testar a API:

1.  **Instalar as dependências do projeto:** Primeiro, instale as dependências necessárias usando o comando apropriado, dependendo do seu gerenciador de pacotes.

    - **Usando npm:**

      bash

      `npm install`

    - **Usando yarn:**

      bash

      `yarn install`

2.  **Buildar a aplicação:** Compile o código TypeScript para JavaScript.

    - **Usando npm:**

      bash

      `npm run build`

    - **Usando yarn:**

      bash

      `yarn build`

3.  **Subir os contêineres Docker:** Com o Docker Compose, você pode rodar a aplicação e o banco de dados PostgreSQL em contêineres separados.

    bash

    `docker-compose up`

4.  **Rodar os testes:** Após rodar os contêineres, você pode executar os testes.

    - **Usando npm:**

      bash

      `npm run test:docker`

    - **Usando yarn:**

      bash

      `yarn test:docker`

---

## Tabela de Conteúdos

1.  [Pré-requisitos](#pr%C3%A9-requisitos)
2.  [Rodando o Projeto](#rodando-o-projeto)
    - [Com Docker](#com-docker)
    - [Localmente](#localmente)
3.  [Comandos do Projeto](#comandos-do-projeto)
4.  [Testes](#testes)
    - [Rodando Testes Localmente](#rodando-testes-localmente)
    - [Rodando Testes com Docker](#rodando-testes-com-docker)
5.  [Migrações de Banco de Dados](#migra%C3%A7%C3%B5es-de-banco-de-dados)
6.  [Variáveis de Ambiente](#vari%C3%A1veis-de-ambiente)
7.  [Desligando os Contêineres](#desligando-os-cont%C3%AAineres)

---

## Pré-requisitos

Certifique-se de que você tenha as seguintes ferramentas instaladas:

- Docker
- Docker Compose
- [Node.js](https://nodejs.org/) (recomendado: versão 20 ou superior)
- [npm](https://www.npmjs.com/)
- [Vitest](https://vitest.dev/) para execução de testes

---

## Rodando o Projeto

### Com Docker

Este projeto utiliza o Docker e Docker Compose para configurar e rodar os serviços necessários. Siga os passos abaixo para rodar a aplicação em contêineres Docker.

#### 1\. Clone o Repositório

Clone o repositório para sua máquina local:

bash

`git clone <URL-DO-REPOSITORIO>
cd <NOME-DO-REPOSITORIO>`

#### 2\. Build das Imagens Docker

Para construir as imagens do Docker, execute o seguinte comando:

bash

`docker-compose build`

#### 3\. Subindo os Contêineres

Para rodar os contêineres, execute o comando abaixo. Isso iniciará os serviços do banco de dados PostgreSQL e a API.

bash

`docker-compose up`

Isso iniciará dois contêineres:

- **Postgres**: O banco de dados PostgreSQL.
- **API**: A API Node.js que se conecta ao banco de dados PostgreSQL.

#### 4\. Acessando a Aplicação

Após rodar os contêineres, a API estará disponível na porta `3001` (como configurado no arquivo `docker-compose.yml`):

bash

`http://localhost:3001`

### Localmente

Se preferir rodar a aplicação sem Docker, siga as instruções abaixo.

#### 1\. Instalar Dependências

Para instalar as dependências do projeto, execute o seguinte comando:

bash

`npm install`

#### 2\. Rodar a Aplicação em Modo Desenvolvimento

Execute o servidor em modo de desenvolvimento com `nodemon`:

bash

`npm run dev`

Isso iniciará o servidor com recarga automática a cada alteração no código.

#### 3\. Rodar as Migrações

Para rodar as migrações do banco de dados localmente, execute:

bash

`npm run migrate`

---

## Comandos do Projeto

Aqui estão alguns dos comandos principais que você pode executar no projeto.

- **Rodar a Aplicação em Desenvolvimento**:

bash

`npm run dev`

- **Compilar o Código TypeScript**:

bash

`npm run build`

- **Iniciar o Servidor Localmente (após o build)**:

bash

`npm run start`

- **Rodar as Migrações**:

bash

`npm run migrate`

- **Criar uma Nova Migração**:

bash

`npm run migrate:create --name nome_da_migracao`

- **Rodar os Testes**:

bash

`npm run test`

- **Rodar os Testes com Docker**:

bash

`docker-compose run --rm api npm run test`

---

## Testes

O projeto usa [Vitest](https://vitest.dev/) para os testes.

### Rodando Testes Localmente

Para rodar os testes localmente, execute o seguinte comando:

bash

`npm run test`

Isso executará os testes definidos no projeto.

### Rodando Testes com Docker

Se preferir rodar os testes dentro do Docker, use o comando:

bash

`docker-compose run --rm api npm run test`

---

## Migrações de Banco de Dados

As migrações do banco de dados podem ser executadas utilizando o comando:

bash

`npm run migrate`

Se você precisar gerar uma nova migração, utilize:

bash

`npm run migrate:create --name nome_da_migracao`

### Migrando o Banco de Dados com Docker

Se você estiver utilizando o Docker, para rodar as migrações dentro do contêiner, use:

bash

`docker-compose run --rm api npm run migrate`

---

## Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente corretamente. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

bash

`DB_USER=<seu_usuario>
DB_PASSWORD=<sua_senha>
DB_NAME=<nome_do_banco>
DB_HOST=postgres
DB_PORT=5432`

Alternativamente, você pode definir essas variáveis diretamente no `docker-compose.yml` para a configuração do serviço `api`.

---

## Desligando os Contêineres

Para desligar os contêineres, execute o comando:

bash

`docker-compose down`

Isso interromperá todos os contêineres em execução e removerá os contêineres criados.

### Documentação e Explicação:

- **Middleware para Tratamento de Erros:**

  - **O que faz:** Captura e trata os erros de forma centralizada.
  - **Como melhora a segurança:** Garante que os detalhes internos do erro não sejam expostos para o usuário final, prevenindo vazamento de dados sensíveis.
  - **Como melhora a manutenção:** Torna o tratamento de erros mais organizado e facilita a depuração.

- **Autenticação com JWT:**

  - **O que faz:** Protege rotas sensíveis, garantindo que apenas usuários autenticados possam acessá-las.
  - **Como melhora a segurança:** Impede o acesso não autorizado e garante a integridade dos dados do usuário.
  - **Como melhora a manutenção:** Não requer armazenar sessões no servidor, tornando a API mais escalável e fácil de manter.

- **Configuração de CORS:**

  - **O que faz:** Define quais domínios podem acessar a API.
  - **Como melhora a segurança:** Evita que sites maliciosos façam requisições indesejadas.
  - **Como melhora a manutenção:** Facilita a gestão de permissões, especialmente em ambientes com múltiplos domínios.
