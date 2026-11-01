from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Handle Postgres / Neon URL formatting (convert 'postgres://' to 'postgresql://')
raw_url = settings.DATABASE_URL
if raw_url.startswith("postgres://"):
    database_url = raw_url.replace("postgres://", "postgresql://", 1)
else:
    database_url = raw_url

# For SQLite, check_same_thread must be False; for Postgres/Neon, use empty dict
is_sqlite = database_url.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

# Engine configuration (with pool_pre_ping and pool_recycle for Neon serverless resilience)
engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300 if not is_sqlite else -1,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
