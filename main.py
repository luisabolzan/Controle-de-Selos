import sqlalchemy
from sqlalchemy import (create_engine, Column, Integer, String, Boolean, 
                        DateTime, ForeignKey, Enum)
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import enum

# pessoal, aqui voces colocam a url do banco de dados que voces criaram
DATABASE_URL = "postgresql+psycopg://postgres:trabalho1234@localhost:5432/meu_app_db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()

class Usuario(Base):

    __tablename__ = 'usuarios'
    
    cpf = Column(String(11), primary_key=True, index=True, name="cpf")
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    num_telefone = Column(String(20), nullable=True)
    is_adm = Column(Boolean, default=False)
    numero_vinculo_ufrgs = Column(String(50), nullable=True)
    has_active_request = Column(Boolean, default=False)

class Veiculo(Base):

    __tablename__ = 'veiculos'

    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String(10), unique=True, nullable=False, index=True)
    modelo = Column(String(50), nullable=False)
    cor = Column(String(30), nullable=False)

class VeiculosDeUsuarios(Base):
    __tablename__ = 'veiculos_de_usuarios'
    usuario_cpf = Column(String, ForeignKey('usuarios.cpf'), primary_key=True)
    veiculo_id = Column(Integer, ForeignKey('veiculos.id'), primary_key=True)

class Login(Base):

    __tablename__ = 'logins'
    
    usuario_cpf = Column(String, ForeignKey('usuarios.cpf'), primary_key=True)
    senha = Column(String(255), nullable=False)
    access_token = Column(String(255), nullable=True)
    created_date = Column(DateTime, default=datetime.utcnow)
    last_access_date = Column(DateTime, nullable=True)

class TipoSelo(enum.Enum):
    provisorio = "Provisório"
    eventual = "Eventual"
    servico = "Serviço"

class Selo(Base):

    __tablename__ = 'selos'
    
    identificador = Column(Integer, primary_key=True, index=True)
    tipo = Column(Enum(TipoSelo), nullable=False)
    d_inicio = Column(DateTime, nullable=True)
    d_fim = Column(DateTime, nullable=True)
    disponivel = Column(Boolean, default=True)
    register_date = Column(DateTime, default=datetime.utcnow)

class Solicitacao(Base):

    __tablename__ = 'solicitacoes'

    id = Column(Integer, primary_key=True, index=True)
    datetime_solicitacao = Column(DateTime, default=datetime.utcnow)
    is_approved = Column(Boolean, nullable=True)
    avaliado = Column(Boolean, default=False)

    veiculo_id = Column(Integer, ForeignKey('veiculos.id'), nullable=False)
    usuario_cpf = Column(String, ForeignKey('usuarios.cpf'), nullable=False)
    
class Emprestimo(Base):
    __tablename__ = 'emprestimos'
    
    id = Column(Integer, primary_key=True, index=True)
    datetime_inicio_validade = Column(DateTime, nullable=False)
    datetime_fim_validade = Column(DateTime, nullable=False)
    vencido_terminado = Column(Boolean, default=False)
    created_date = Column(DateTime, default=datetime.utcnow)

    selo_id = Column(Integer, ForeignKey('selos.identificador'), nullable=False, unique=True)
    veiculo_id = Column(Integer, ForeignKey('veiculos.id'), nullable=False)
    usuario_cpf = Column(String, ForeignKey('usuarios.cpf'), nullable=False)

Base.metadata.create_all(bind=engine)
print("Executou comando de criar tabelas (ainda não sei tratar erros aqui)")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = SessionLocal()

# IMPORTANTE: aqui tem um código que eu pedi pra IA gerar pra testar se as tabelas estão funcionando
print("Iniciando teste de criação de usuário...")

    # Dados do usuário de teste
cpf_teste = "11122233344"
email_teste = "usuario.teste@exemplo.com"
nome_teste = "Usuário de Teste"

try:
    # Passo 1: Verifica se o usuário já existe e o remove para garantir um teste limpo
    usuario_existente = db_session.query(Usuario).filter(Usuario.cpf == cpf_teste).first()
    if usuario_existente:
        print(f"Usuário com CPF {cpf_teste} já existe. Removendo para o teste...")
        db_session.delete(usuario_existente)
        db_session.commit()

    # Passo 2: Cria a nova instância do usuário
    novo_usuario = Usuario(
        cpf=cpf_teste,
        nome=nome_teste,
        email=email_teste,
        num_telefone="51912345678"
    )
        
    # Passo 3: Adiciona o usuário à sessão e comita (salva) no banco
    print(f"Adicionando o usuário '{nome_teste}' ao banco de dados...")
    db_session.add(novo_usuario)
    db_session.commit()
        
    print("Usuário adicionado com sucesso!")

    # Passo 4: Busca o usuário no banco para verificar se foi salvo corretamente
    print("Verificando se o usuário foi salvo...")
    usuario_no_banco = db_session.query(Usuario).filter(Usuario.cpf == cpf_teste).first()
        
    if usuario_no_banco and usuario_no_banco.nome == nome_teste:
        print("\n--- SUCESSO! ---")
        print("O usuário foi encontrado no banco de dados:")
        print(f"  CPF: {usuario_no_banco.cpf}")
        print(f"  Nome: {usuario_no_banco.nome}")
        print(f"  Email: {usuario_no_banco.email}")
        print("------------------")
    else:
        print("\n--- FALHA! ---")
        print("O usuário não foi encontrado no banco de dados após a criação.")

except Exception as e:
    print(f"\nOcorreu um erro durante o teste: {e}")
    db_session.rollback()  # Reverte a transação em caso de erro
finally:
    # Fecha a sessão para liberar a conexão com o banco
    db_session.close()
    print("\nSessão com o banco de dados fechada. Teste finalizado.")