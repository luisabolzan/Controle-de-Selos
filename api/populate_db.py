import os
import random
import bcrypt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from faker import Faker

# Importa seus modelos
from database_models import Base, Users, Vehicles, UsersVehicles, Tags, TagTypes, Solicitation, Loan

# Configurações
load_dotenv()
fake = Faker('pt_BR') # Gera dados brasileiros (CPF, Nomes, etc)
DATABASE_URL = os.getenv("DATABASE_URL")

# Quantidade de dados para gerar
NUM_USERS = 5    
NUM_VEHICLES = 5
NUM_TAGS = 5
NUM_SOLICITATIONS = 10
NUM_LOANS = 3

def get_engine_session():
    if not DATABASE_URL:
        print("ERRO: DATABASE_URL não encontrada.")
        exit(1)
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    return engine, Session()

def generate_cpf():
    """Gera CPF sem pontuação"""
    return fake.cpf().replace('.', '').replace('-', '')

def generate_plate():
    """Gera placa padrão Mercosul ou Antiga"""
    letters = "".join(random.choices("ABCDEFGHIJKLMNOPQRSTUVWXYZ", k=3))
    numbers = "".join(random.choices("0123456789", k=4))
    return f"{letters}-{numbers}"

def hash_password(password):
    """Gera hash compatível com seu sistema"""
    # Usando um salt fixo ou simples para popular rápido
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def populate():
    print("--- Iniciando População do Banco de Dados ---")
    engine, session = get_engine_session()
    
    # (Opcional) Recriar tabelas para começar limpo
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 1. CRIAR USUÁRIOS
    print(f"Gerando {NUM_USERS} Usuários...")
    default_pass = hash_password("123456") # Senha padrão para todos
    users_list = []

    # Admin Fixo
    admin = Users(
        password_hash=default_pass,
        # cpf="00000000000",
        email="admin@admin.com",
        name="admin",
        phone_number="51999999999",
        is_admin=True,
        has_active_request=False
    )
    users_list.append(admin)

    for _ in range(NUM_USERS):
        user = Users(
            password_hash=default_pass,
            # cpf=generate_cpf(),
            email=fake.unique.email(),
            name=fake.name(),
            phone_number=fake.cellphone_number(),
            is_admin=random.choice([True, False, False, False]), # 25% chance de ser admin
            has_active_request=False
        )
        users_list.append(user)
    
    session.add_all(users_list)
    session.commit() # Comita para gerar os IDs
    print("Usuários criados.")

    # 2. CRIAR VEÍCULOS
    print(f"Gerando {NUM_VEHICLES} Veículos...")
    vehicles_list = []
    car_models = ['Fusca', 'Gol', 'Onix', 'HB20', 'Civic', 'Corolla', 'Uno', 'Fiesta', 'Focus', 'Cruze']
    colors = ['Branco', 'Preto', 'Prata', 'Vermelho', 'Azul', 'Cinza']

    for _ in range(NUM_VEHICLES):
        vehicle = Vehicles(
            plate=fake.unique.license_plate(),
            model=random.choice(car_models),
            color=random.choice(colors)
        )
        vehicles_list.append(vehicle)
    
    session.add_all(vehicles_list)
    session.commit()
    print("Veículos criados.")

    # 3. VINCULAR USUÁRIOS E VEÍCULOS
    print("Vinculando Usuários a Veículos...")
    all_users = session.query(Users).all()
    all_vehicles = session.query(Vehicles).all()

    for user in all_users:
        # Cada usuário tem entre 0 e 2 carros
        num_cars = random.randint(0, 2)
        selected_vehicles = random.sample(all_vehicles, k=min(num_cars, len(all_vehicles)))
        
        for v in selected_vehicles:
            link = UsersVehicles(user_id=user.user_id, vehicle_id=v.vehicle_id)
            session.add(link)
    
    session.commit()

    # 4. CRIAR TAGS
    print(f"Gerando {NUM_TAGS} Tags...")
    tags_list = []
    types = [TagTypes.service, TagTypes.temp, TagTypes.eventual]
    
    for _ in range(NUM_TAGS):
        tag = Tags(
            tag_type=random.choice(types),
            available=True, # Vamos alterar algumas para False nos Empréstimos
            register_date=fake.date_time_between(start_date='-1y', end_date='now')
        )
        tags_list.append(tag)
    
    session.add_all(tags_list)
    session.commit()

    # 5. CRIAR SOLICITAÇÕES (Histórico)
    print(f"Gerando {NUM_SOLICITATIONS} Solicitações...")
    
    for _ in range(NUM_SOLICITATIONS):
        user = random.choice(all_users)
        # Tenta pegar um veículo do usuário, se não tiver, pega aleatório ou None
        # (Dependendo da regra de negócio, service tag pode ter veiculo ou não)
        vehicle = random.choice(all_vehicles) 
        
        # Datas aleatórias
        start = fake.date_time_between(start_date='-3m', end_date='+1m')
        end = start + timedelta(days=random.randint(1, 15))
        
        # Status da solicitação
        is_reviewed = random.choice([True, False, False]) # Mais chance de n ser revisada
        is_approved = False
        if is_reviewed:
            is_approved = random.choice([True, False])

        solicitation = Solicitation(
            creation_date=fake.date_time_between(start_date='-4m', end_date=start),
            is_approved=is_approved,
            reviewed=is_reviewed,
            start_date=start,
            end_date=end,
            solicited_tag_type=random.choice(types),
            vehicle_id=vehicle.vehicle_id,
            user_id=user.user_id
        )
        session.add(solicitation)
        
        # Atualiza flag do usuário se tiver solicitação pendente
        if not is_reviewed:
            user.has_active_request = True
            session.add(user)

    session.commit()

    # 6. CRIAR EMPRÉSTIMOS (Loans)
    print(f"Gerando {NUM_LOANS} Empréstimos Ativos/Passados...")
    all_tags = session.query(Tags).all()

    for _ in range(NUM_LOANS):
        tag = random.choice(all_tags)
        
        # Só cria empréstimo se a tag estava "disponível" na nossa lógica de loop
        # (Na prática, se ela já foi usada num loan ativo, não poderia usar de novo,
        # mas aqui é só seed data)
        
        user = random.choice(all_users)
        vehicle = random.choice(all_vehicles)
        
        is_expired = random.choice([True, False])
        
        start_date = fake.date_time_between(start_date='-2m', end_date='now')
        
        if is_expired:
            # Empréstimo passado e devolvido
            end_date = start_date + timedelta(days=random.randint(1, 5))
            # Tag volta a ficar livre (teoricamente)
        else:
            # Empréstimo ATIVO
            end_date = datetime.now() + timedelta(days=random.randint(2, 10))
            tag.available = False # Marca tag como ocupada
            session.add(tag)

        loan = Loan(
            start_date=start_date,
            end_date=end_date,
            expired=is_expired, # Na sua model 'expired' parece boolean, pode ser usado como flag de "já venceu" ou "encerrado"
            creation_date=start_date,
            tag_id=tag.tag_id,
            vehicle_id=vehicle.vehicle_id,
            user_id=user.user_id
        )
        session.add(loan)

    session.commit()
    session.close()
    print("--- Banco de Dados Populado com Sucesso! ---")
    print("Login Admin: admin@admin.com / 123456")

if __name__ == "__main__":
    populate()