from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Cargar .env desde la carpeta raíz del proyecto (backend/)
# Esto funciona tanto si ejecutas desde backend/ como desde la raíz.
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Si aún es None, lanza un error claro
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("No se encontró DATABASE_URL en el archivo .env. Verifica que exista y esté bien escrito.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()