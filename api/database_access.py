import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

class DatabaseAccess:
    def __init__(self):
        load_dotenv()
        # Create a .env file in the root directory with the line:
        # DATABASE_URL=your_database_url_here
        db_url = os.getenv("DATABASE_URL")
        
        engine = create_engine(db_url)
        self.session = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
