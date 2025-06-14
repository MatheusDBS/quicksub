# QuickSub

QuickSub é uma aplicação web para gerenciamento de assinaturas de serviços, com fluxo de solicitações especiais e painel administrativo. Com ela, você pode cadastrar clientes, serviços, controlar assinaturas, datas de início e fim, status e valores pagos, além de solicitar a adição de novos serviços para aprovação do administrador.

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Cadastro de clientes e serviços
- Gerenciamento de assinaturas (início, fim, status, valores)
- Visualização e controle de planos e valores
- **CRUD completo de serviços/planos, assinaturas e solicitações**
- **Solicitação de novos serviços:** Usuário pode solicitar a adição de um novo serviço, admin aprova/rejeita e responde
- **Painel do usuário:** Visualização de assinaturas, perfil, solicitações e respostas recebidas
- **Painel do admin:** Gerenciamento de serviços, respostas a solicitações, edição de perfil
- **Fluxo de leitura:** Solicitações respondidas somem para o admin; para o usuário, somem após serem lidas
- **Perfil:** Edição de dados do usuário/admin (exceto exclusão de conta para admin)
- **Logo personalizada** (coloque sua logo em `src/assets/Logo.png`)

## Tecnologias Utilizadas

- Backend: Node.js, Express, MySQL
- Frontend: React

## Como usar

1. Instale as dependências com `npm install` nas pastas do backend e frontend
2. Configure o banco de dados MySQL usando o arquivo `dumpsql.txt`
3. **Importante:** Edite o arquivo `.env` na raiz do projeto e coloque a senha correta do seu MySQL na variável `DB_PASSWORD`
4. Inicie o backend e o frontend com `npm start`
5. Para acessar como administrador, crie um usuário chamado `admin` com a senha `admin@123`

## Observações

- Caso o sistema não funcione, verifique se a senha do seu MySQL está correta no arquivo `.env`
- O sistema utiliza autenticação JWT para proteger as rotas
- O fluxo de solicitações de novos serviços é a rotina especial exigida no projeto

Ideal para quem deseja organizar e acompanhar todas as suas assinaturas em um só lugar, com flexibilidade para solicitar novos serviços!