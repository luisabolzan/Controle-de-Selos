import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .database_models import Base

class _DatabaseAccess:
    def __init__(self):
        load_dotenv()
        # Create a .env file in the root directory with the line:
        # DATABASE_URL=your_database_url_here
        db_url = os.getenv("DATABASE_URL")
        
        self.engine = create_engine(db_url)
        self.session = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)()
        Base.metadata.create_all(bind=self.engine)
        
        
db_access = _DatabaseAccess()

def get_db():
    db = db_access.session()
    try:
        yield db
    finally:
        db.close()
    