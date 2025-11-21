![Testes Automatizados](https://github.com/luisabolzan/Controle-de-Selos/actions/workflows/ci.yml/badge.svg)

# Controle-de-Selos

Este projeto foi desenvolvido como uma solução para modernizar o controle de selos de estacionamento da UFRGS, que atualmente depende de registros em papel e planilhas manuais. O objetivo principal é criar um sistema centralizado e digital para gerenciar a distribuição dos selos de forma eficiente e segura. 

## Tecnologias Utilizadas

* **Linguagem:** Python, TypeScript
* **Frameworks:** FastAPI (back-end), React (front-end)
* **Banco de Dados:** PostgreSQL
* **Ferramentas e Bibliotecas:** SQLAlchemy, Node.js, Git

## Como Executar o Projeto
Atualmente, enquanto o projeto está sendo executado localmente, é necessário seguir os passos abaixo.

### Pré-requisitos
Antes de começar, garanta que você tenha os seguintes softwares instalados na sua máquina:
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/downloads/) (versão 3.8 ou superior)
- [Node.js](https://nodejs.org/) (versão LTS)
- [PostgreSQL](https://www.postgresql.org/download/)

```bash
# 1. Clone o repositório
git clone https://github.com/luisabolzan/Controle-de-Selos.git

# 2. Navegue até a pasta do projeto
cd Controle-de-Selos
```

### 1. Configuração do Backend (API)
O backend é responsável por servir os dados para a aplicação.

1. Navegue até a pasta da API
```bash
cd api
```

2. Crie e ative um ambiente virtual
```bash
python -m venv .venv
```
No Linux/macOS:
source .venv/bin/activate
No Windows:
```bash
.\.venv\Scripts\activate
```

3. Instale as dependências
```bash
pip install -r requirements.txt
```

4. Configure o Banco de Dados
    a. Crie um banco de dados no PostgreSQL (ex: 'selos_db').
    b. Crie um arquivo .env na raiz do projeto (Controle-de-Selos)
    c. Adicione a sua URL de conexão ao .env:
   ```bash
       DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/selos_db"
   ```
   
5. Rode o servidor da API
   (O Uvicorn irá criar as tabelas no primeiro acesso)
```bash
uvicorn main:app --reload
```
O backend estará rodando em http://127.0.0.1:8000. Você pode acessar a documentação interativa em http://127.0.0.1:8000/docs.

### 2. Configuração do Frontend (React)
A interface do usuário que consome os dados do backend.

Abra um novo terminal na raiz do projeto

1. Navegue até a pasta do frontend
```bash
cd front
```

2. Instale as dependências
```bash
npm install
```

3. Rode a aplicação React
```bash
npm run dev
```
O frontend estará disponível em http://localhost:3000.
