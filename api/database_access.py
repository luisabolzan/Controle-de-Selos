import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

class DatabaseAccess:
    def __init__(self):
        load_dotenv()
        # Create a .env file in the root directory with the line:
        # DATABASE_URL=your_database_url_here
        db_url = os.getenv("DATABASE_URL")
        self.engine = create_engine(db_url)
        self.connection = self.engine.connect()
