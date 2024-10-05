from sqlalchemy import create_engine, Column, Float, String, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = 'postgresql://postgres:12345678@localhost:5432/postgres'

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

class Fatura(Base):
    __tablename__ = 'faturas'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    cliente_id = Column(BigInteger, nullable=False)
    referente_a = Column(String, nullable=False)
    energia_eletrica_kwh = Column(BigInteger)
    energia_eletrica_valor = Column(Float)
    energia_sceee_kwh = Column(BigInteger)
    energia_sceee_valor = Column(Float)
    energia_compensada_kwh = Column(BigInteger)
    energia_compensada_valor = Column(Float)
    contrib_ilum_publica_valor = Column(BigInteger)

Base.metadata.create_all(engine)